const User=require('../models/user_model')
const nodemailer=require('nodemailer')
const UserOTPverification=require('../models/userOTPverifivcation')
const Category=require('../models/category_model')
const Product=require('../models/product_model')


const bcrypt = require('bcrypt');
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password , 10);
        return passwordHash;  
    } catch (error) {
        console.log(error.message);       
    }
};


const loadHome=async(req,res)=>{
    try {
        const user=req.session.user
        const userData=await User.findOne({_id:user})
        res.render('home',{userData,user})
    } catch (error) {
        console.log(error);
    }
}

const loadLogin=async(req,res)=>{
    try {
        let errms = req.flash('errms')
        res.render('login',{errms})
    } catch (error) {
        console.log(error); 
    }
}

const loadRegister=async(req,res)=>{
    try {
        res.render('registration')
    } catch (error) {
        console.log(error);
    }
}

const loadcontactUs=async(req,res)=>{
    try {
        const user=req.session.user
        const userData=await User.findOne({_id:user})
        res.render('contact',{userData})
    } catch (error) {
        console.log(error);
    }
}

const loadAbuotUs=async(req,res)=>{
    try {
        const user=req.session.user
        const userData=await User.findOne({_id:user})
        res.render('about',{userData})
    } catch (error) {
        console.log(error);
    }
}

const loadProduct=async(req,res)=>{
    try {
        const user=req.session.user
        const userData=await User.findOne({_id:user})
        const categories=await Category.find({is_Listed:true})
        const products=await Product.find({is_delete:true})
        res.render('allProduct',{categories,products,userData})
    } catch (error) {
        console.log(error);
    }
}
const loadDetails=async(req,res)=>{
    try {
        const product=req.query.id
        const products=await Product.findById({_id:product})
        res.render('productDetails',{products})
    } catch (error) {
        console.log(error);
    }
}

const insertUser = async (req, res) => {
    try {
        const { fname, mobile,email, password, confirmPassword } = req.body
        const exist = await User.findOne({ email: req.body.email })
        if (exist) {
            let message = 'Email already Exists..';
            req.flash('errormsg', message);
            res.redirect('/register');
        } else {
            const spassword = await securePassword(password)
            if(password==confirmPassword){
                const newUser = {
                    name: fname,
                    mobile: mobile,
                    email: email,
                    password: spassword,
                    is_admin: 0,
                    is_verified: false
                };
              
                req.session.user=newUser
                
                if (newUser) {
                    await sendOTPMail(email, res);
                    let sucmsg = 'Successfully created your Account. Please check your email for OTP verification.';
                    req.flash('success', sucmsg);
                    res.redirect('/otp');
                } else {
                    res.redirect('/register');
                }
            }else{
                console.log('password not match');
            }  
        }
    } catch (error) {
        console.log(error);
    }
}


const sendOTPMail = async (email , res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: true,
            requireTLS: true,

            auth: {
                user: 'muhammedfayizputhiyaparambil@gmail.com',
                pass: 'amfr gibr vhxt hwca'
            }
        });

        const otp = Math.floor(1000 + Math.random() * 9000); 
        console.log('OTP', otp);
        const saveOtptoDashboard = await new UserOTPverification({ email: email, otp: otp });
        await saveOtptoDashboard.save();

        const mailOptions = {
            from: 'muhammedfayizputhiaparambil@gmail.com',
            to: email,
            subject: 'Verify Your Email',
            html: `Your OTP is : ${otp}`
        };

        await transporter.sendMail(mailOptions);

        res.redirect(`/otp?email=${email}`); 

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error'); 
    }
}

const loadOTP = async(req,res)=>{
    try {
        const email = req.session.user.email
        console.log(email);
        res.render('otpVerification',{email : email})
    } catch (error) {
        console.log(error.message);
    }
}

const VerifyOTP = async (req, res) => {
    try {
       
        const digit1 = req.body.digit1;
        const digit2 = req.body.digit2;
        const digit3 = req.body.digit3;
        const digit4 = req.body.digit4;  
        const otp =""+digit1+digit2+digit3+digit4;
   
        const otpVerify = await UserOTPverification.findOne({ otp: otp });

        if (!otpVerify) {
        
            res.json({ success: false });
            return;
        }

       
        if (!req.session.user) {
            
            res.json({ success: false, message: 'User not found' });
            return;
        }

        const user=new User(req.session.user)
        await user.save()
       await User.findByIdAndUpdate({ _id: user._id }, { $set: { is_verified: 1 } });
        req.session.user=null
        
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


    

const verifylogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                if(userData.is_verified==1){
                req.session.user =userData._id;
                res.redirect('/')
                }else{
                    let mes='admin has blocked you'
                    req.flash('errms',mes)
                    res.redirect('/login')
                }
            } else {
                let message = 'Email or password incorrect..';
                req.flash('errmsg', message);
                res.redirect('/login');
            }
        } else {
            let message = 'Email or password incorrect..';
            req.flash('errmsg', message);
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error'); 
    }
}
const userLogout=async(req,res)=>{
    try {
        req.session.user=null
        res.redirect('/login')
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    loadHome,
    securePassword,
    loadLogin,
    sendOTPMail,
    loadRegister,
    loadcontactUs,
    loadAbuotUs,
    loadProduct,
    insertUser,
    verifylogin,
    VerifyOTP,
    loadOTP,
    loadDetails,
    userLogout,
}
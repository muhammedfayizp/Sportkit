const User=require('../models/user_model')
const nodemailer=require('nodemailer')
const UserOTPverification=require('../models/userOTPverifivcation')
const Category=require('../models/category_model')
const Product=require('../models/product_model')
const Wishlist=require('../models/wishlist_model')


const bcrypt = require('bcrypt');
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password , 10);
        return passwordHash;  
    } catch (error) {
        console.log(error.message);       
    }
};


const loadHome = async (req, res) => {
    try {
        const user = req.session.user;
        const products = await Product.find({ is_delete: true });
        const categories = await Category.find({ is_Listed: true });
        let userData = null;

        if (user) {
            userData = await User.findById(user);
            if (!userData.is_verified) {
                req.session.user = null;
                res.redirect('/login');
                return;
            }
        }

        res.render('home', { userData, products, categories });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

const loadLogin=async(req,res)=>{
    try {
        const categories=await Category.find({is_Listed:true})
        const successmsg=req.flash('successmsg')
        let errormsg = req.flash('errormsg')
        res.render('login',{errormsg,successmsg,categories})
    } catch (error) {
        console.log(error); 
    }
}

const loadRegister=async(req,res)=>{
    try {
        const categories=await Category.find({is_Listed:true})
        let errormsg = req.flash('errormsg')
        res.render('registration',{errormsg,categories})
    } catch (error) {
        console.log(error);
    }
}

const loadcontactUs=async(req,res)=>{
    try {
        const user=req.session.user
        const userData=await User.findOne({_id:user})
        const categories=await Category.find({is_Listed:true})
        res.render('contact',{userData,categories})
    } catch (error) {
        console.log(error);
    }
}

const loadAbuotUs=async(req,res)=>{
    try {
        const user=req.session.user
        const userData=await User.findOne({_id:user})
        const categories=await Category.find({is_Listed:true})
        res.render('about',{userData,categories})
    } catch (error) {
        console.log(error);
    }
}

const loadProduct = async (req, res) => {
    try {
        const user = req.session.user;
        const userData = await User.findOne({ _id: user });
        const categories = await Category.find({ is_Listed: true });
        let allproducts = await Product.find({ is_delete: true });

        const selectedCategory = req.query.filtered;
        const priceType=req.query.selectedPrice
        const selectedType=req.query.sortBy

        const page = parseInt(req.query.page)||1;
        const limit = 6;
        const skip = (page-1)*limit;

        let products = await Product.find({is_delete:true}).skip(skip).limit(limit);

        const totalProduct = await Product.countDocuments(products);
        const totalPages = Math.ceil(totalProduct / limit);
        let prevPage = page - 1;
        let nextPage = page + 1;
        if (prevPage < 1) prevPage = 1;
        if (nextPage > totalPages) nextPage = totalPages;

        for (let product of allproducts) {
            const productCategory = await Category.findById(product.category);
            if (productCategory) {
                product.categoryName = productCategory.name;
            }
        }
    
        if (selectedCategory) {
            products = await Product.find({ category: selectedCategory, is_delete: true });
        }else if(priceType==='high-to-low'){
            products=await Product.find({is_delete:true}).sort({price:-1})
        }else if(priceType==='low-to-high'){
            products=await Product.find({is_delete:true}).sort({price:1})
        }else if (selectedType==='asse') {
            products=await Product.find({is_delete:true}).sort({name:1})
        }else if(selectedType==='disse'){
            products=await Product.find({is_delete:true}).sort({name:-1})
        }

       
        res.render('allProduct', { categories, allproducts, userData ,products:products,totalPages,prevPage,nextPage,page});
        
    } catch (error) {
        console.error("Error loading products:", error);
    }
};
const loadDetails=async(req,res)=>{
    try {
        const product=req.query.id
        const products=await Product.findById({_id:product})
        const categories=await Category.find({is_Listed:true})

        res.render('productDetails',{products,categories})
    } catch (error) {
        console.log(error);
    }
}

const insertUser = async (req, res) => {
    try {
        const { fname, mobile, email, password, confirmPassword } = req.body;
        const exist = await User.findOne({ email: email });
        if (exist) {
            req.flash('errormsg', 'Email already Exists');
            return res.redirect('/register');
        } else {
            const spassword = await securePassword(password);
            if (password === confirmPassword) {
                const newUser = {
                    name: fname,
                    mobile: mobile,
                    email: email,
                    password: spassword,

                    is_admin: 0,
                    is_verified: false
                };
                    req.session.user=newUser

                    await sendOTPMail(email, res);
                    return res.redirect('/otp');
   
            } else {
                console.log('password not match');
                return res.redirect('/register');
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const sendOTPMail = async (email , req,res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'muhammedfayizputhiyaparambil@gmail.com',
                pass: 'nzio fgpe pyvy dypa'
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
        req.session.email = email;
        res.redirect(`/otp?email=${email}`); 

    } catch (error) {
        console.log(error.message);
    }
}

const loadOTP = async(req,res)=>{
    try {
        const email = req.session.user.email
        const categories=await Category.find({is_Listed:true})

        res.render('otpVerification',{email : email,categories})
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
                    req.flash('errormsg','admin has blocked you')
                    res.redirect('/login')
                }
            } else {
                req.flash('errormsg', 'Email or password incorrect');
                res.redirect('/login');
            }
        } else {
            req.flash('errormsg', 'Email or password incorrect');
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error'); 
    }
}

const resendOtp=async(req,res)=>{
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).send('Email is required');
        }
        await sendOTPMail(email, res);
        res.redirect(`/otp?email=${email}`);
    } catch (error) {
        console.log(error);
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

const loadWishlist=async(req,res)=>{
    try {
        const userId=req.session.user
        const userData=await User.findOne({_id:userId})
        const categories=await Category.find({is_Listed:true})
        const populateWishlist = await Wishlist.findOne({UserId:userId}).populate('items.productId').exec();
        if (!populateWishlist) {
            res.render('wishlist', { userData, wishlistData: [], categories });
            return;
        }
        const wishlistData=populateWishlist.items
        res.render('wishlist', { userData,categories,wishlistData });
    } catch (error) {
        console.log(error);
    }
}

const addToWishlist = async (req, res) => {
    try {
        if (req.session.user) {
            const userId = req.session.user;
            const userWishlist = await Wishlist.findOne({ UserId: userId });
            const productId = req.body.productId;
            const product = await Product.findById(productId);

            if (userWishlist) {
                const exist = userWishlist.items.some(item => item.productId.equals(productId));
                if (!exist) {
                    userWishlist.items.push({ productId: product._id });
                    await userWishlist.save();
                    res.json({ success: true });
                } else {
                    res.json({ success: false });
                }
            } else {
                const newWishlist = new Wishlist({
                    UserId: userId,
                    items: [{ productId: product._id }]
                });
                await newWishlist.save();
                res.json({ success: true });
            }
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const productRemove = async (req, res) => {
    try {
        const userId = req.session.user;
        const { productId } = req.query;
        const userWishlist = await Wishlist.findOne({ UserId: userId });
        if (userWishlist && userWishlist.items) {
            const productToRemove = userWishlist.items.find(product => product.productId.toString() === productId);

            if (productToRemove) {
                const updatedProducts = userWishlist.items.filter(product => product.productId.toString() !== productId);

                const updatedWishlist = await Wishlist.findOneAndUpdate(
                    { UserId: userId },
                    {
                        $set: {
                            items: updatedProducts,
                        }
                    },
                    { new: true }
                );
                return res.json({ success: true, wishlist: updatedWishlist });
            } else {
                return res.json({ success: false, message: 'Product not found in cart' });
            }

        }
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
    resendOtp,
    loadWishlist,
    addToWishlist,
    productRemove,
    
}
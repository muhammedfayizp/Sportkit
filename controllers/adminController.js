const User=require('../models/user_model')
const bcrypt = require("bcrypt");
const Swal=require('sweetalert2')


const securePass = async (passoword) => {
    try {
        const secuerep = bcrypt.hash(passoword, 10);
        return secuerep;
    } catch (error) {
        console.log(error.message)
    }
}


const loadAdminLogin=async(req,res)=>{
    try {
        res.render('adminlogin')
    } catch (error) {
        console.log(error);
    }
}

const loadUserlist=async(req,res)=>{
    try {
        const users=await User.find()
        res.render('userlist',{users})
    } catch (error) {
        console.log(error);
    }
}

const verifyadminLogin= async (req, res) => {
    try {
        const email = req.body.adminEmail;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    let errormsg='you have no access'
                    req.flash('errormsg',errormsg)
                    res.redirect('/admin/',);
                } else {
                    req.session.admin = userData._id;
                    res.redirect("/admin/dashboard");
                }
            } else {
                req.flash('errormsg','Emial or password incorrect')
                res.redirect('/admin/');
            }

        } else {
            req.flash('errormsg','Emial or password incorrect')

            res.redirect('/admin/');
        }

    } catch (error) {
        console.log(error.message);
    }
}


const loadAdminDashboard = async (req, res) => {
    try {
        // const userData = await User.findById({ _id: req.session.admin });
        // const userData1 = await User.find({ is_admin: 1 })
        res.render('dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

const loadblock=async(req,res)=>{
    try {
        const userid=req.query.userid
        const userdata=await User.findOne({_id:userid})
        const isblocked=userdata.is_verified
        if(isblocked==0){
            await User.findByIdAndUpdate(userid,{$set:{is_verified:1}})
            return res.json({success:true})
        }else{
            await User.findByIdAndUpdate(userid,{$set:{is_verified:0}})
            return res.json({success:true})
        }
    } catch (error) {
       console.log(error); 
    }
}

module.exports={
    loadAdminDashboard,
    loadAdminLogin,
    verifyadminLogin,
    securePass,
    loadUserlist,
    loadblock,
}
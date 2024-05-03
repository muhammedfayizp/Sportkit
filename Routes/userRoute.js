const express=require('express')
const user_Route=express()
const userController=require('../controllers/userController')
const userProfileController=require('../controllers/userProfileController')
const userAuth=require('../middleware/userAuth')

const session = require('express-session');
user_Route.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));


user_Route.set('view engine','ejs')
user_Route.set('views','./views/users')

user_Route.get('/',userAuth.isUser,userController.loadHome)

user_Route.get('/login',userAuth.isLogout,userController.loadLogin)
user_Route.post('/verifylogin',userController.verifylogin)
user_Route.get('/logout',userAuth.isLogin,userController.userLogout)

user_Route.get('/register',userAuth.isLogout,userController.loadRegister)
user_Route.post('/register',userAuth.isLogout,userController.insertUser)

user_Route.get('/contact',userAuth.isUser,userController.loadcontactUs)
user_Route.get('/about',userAuth.isUser,userController.loadAbuotUs)
user_Route.get('/product',userAuth.isUser,userController.loadProduct)
user_Route.get('/productDetails',userAuth.isUser,userController.loadDetails)

user_Route.get('/otp',userAuth.isLogout,userController.loadOTP)
user_Route.post('/verifyotp/:id',userController.VerifyOTP)

user_Route.get('/userProfile',userAuth.isUser,userProfileController.loadUserProfile)
user_Route.post('/editUserProfile',userProfileController.userProfileEdit)
user_Route.get('/userPasChange',userAuth.isUser,userProfileController.loadUserPasChange)
user_Route.post('/pasChanghed',userAuth.isUser,userProfileController.verifyPassword)

user_Route.get('/addressList',userAuth.isUser,userProfileController.loadAddress)
user_Route.post('/addAddress',userProfileController.addressAdding)
user_Route.post('/deleteAddress',userProfileController.Addressdelete)
user_Route.get('/editAddresspage',userProfileController.loadEditAddress)
user_Route.post('/editAddress',userProfileController.AddressEdit)
module.exports=user_Route
const express=require('express')
const user_Route=express()
const userController=require('../controllers/userController')
const userProfileController=require('../controllers/userProfileController')
const userAuth=require('../middleware/userAuth')
const cartController=require('../controllers/cartController')
const checkoutController=require('../controllers/checkoutController')


const session = require('express-session');
user_Route.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));


user_Route.set('view engine','ejs')
user_Route.set('views','./views/users')

user_Route.get('/',userController.loadHome)

user_Route.get('/login',userAuth.isLogout,userController.loadLogin)
user_Route.post('/verifylogin',userController.verifylogin)
user_Route.get('/logout',userAuth.isLogin,userController.userLogout)

user_Route.get('/register',userAuth.isLogout,userController.loadRegister)
user_Route.post('/register',userAuth.isLogout,userController.insertUser)

user_Route.get('/contact',userController.loadcontactUs)
user_Route.get('/about',userController.loadAbuotUs)
user_Route.get('/product',userController.loadProduct)
user_Route.get('/productDetails',userController.loadDetails)

user_Route.get('/otp',userController.loadOTP)
user_Route.post('/verifyotp/:id',userController.VerifyOTP)

user_Route.get('/userProfile',userProfileController.loadUserProfile)
user_Route.post('/editUserProfile',userProfileController.userProfileEdit)
user_Route.get('/userPasChange',userProfileController.loadUserPasChange)
user_Route.post('/pasChanghed',userProfileController.verifyPassword)

user_Route.get('/addressList',userProfileController.loadAddress)
user_Route.post('/addAddress',userProfileController.addressAdding)
user_Route.post('/deleteAddress',userProfileController.Addressdelete)
user_Route.get('/editAddresspage',userProfileController.loadEditAddress)
user_Route.post('/editAddress',userProfileController.AddressEdit)

user_Route.get('/cart',userAuth.isLogin,cartController.loadCart)
user_Route.post('/addToCart',cartController.productaddingtocart)
user_Route.post('/update-quantity',cartController.quantityUpdate)
user_Route.post('/removeCart',cartController.removeProduct)

user_Route.get('/checkout',checkoutController.loadCheckout)

module.exports=user_Route

//test

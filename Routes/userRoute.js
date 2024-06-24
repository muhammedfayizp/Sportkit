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
user_Route.post('/register',userController.insertUser)

user_Route.get('/contact',userController.loadcontactUs)
user_Route.get('/about',userController.loadAbuotUs)
user_Route.get('/product',userController.loadProduct)
user_Route.get('/productDetails',userController.loadDetails)

user_Route.get('/otp',userController.loadOTP)
user_Route.post('/verifyotp/:id',userController.VerifyOTP)
user_Route.get('/resendOTP',userController.resendOtp)

user_Route.get('/userProfile',userAuth.isLogin,userProfileController.loadUserProfile)
user_Route.post('/editUserProfile',userProfileController.userProfileEdit)
user_Route.get('/userPasChange',userAuth.isLogin,userProfileController.loadUserPasChange)
user_Route.post('/pasChanghed',userProfileController.verifyPassword)

user_Route.get('/addressList',userAuth.isLogin,userProfileController.loadAddress)
user_Route.post('/addAddress',userProfileController.addressAdding)
user_Route.post('/deleteAddress',userProfileController.Addressdelete)
user_Route.get('/editAddresspage',userAuth.isLogin,userProfileController.loadProfileEditAddress)
user_Route.post('/editAddress',userProfileController.AddressEdit)

user_Route.get('/cart',userAuth.isLogin,cartController.loadCart)
user_Route.post('/addToCart',cartController.productaddingtocart)
user_Route.post('/update-quantity',cartController.quantityUpdate)
user_Route.post('/removeCart',cartController.removeProduct)

user_Route.get('/checkout',userAuth.isLogin,checkoutController.loadCheckout)
user_Route.post('/checkoutStock',checkoutController.checkStockInCart)
user_Route.post('/addnewAddress',checkoutController.addressnewAdding)
user_Route.get('/checkoutAdsedit',userAuth.isLogin,checkoutController.loadEditAddress)
user_Route.post('/editAdd',checkoutController.checkoutAddressEdit)
user_Route.post('/placeOrder',checkoutController.placeOrder)

user_Route.get('/orderHistoryList',userAuth.isLogin,userProfileController.loadOrderHistory)
user_Route.get('/orderDetails',userAuth.isLogin,userProfileController.loadOrderDetails)
user_Route.post('/cancelOrder',userProfileController.cancelOrder)
user_Route.post('/orderReturn',userProfileController.returnOrder)

user_Route.get('/wishlist',userAuth.isLogin,userController.loadWishlist)
user_Route.post('/addToWishlist',userController.addToWishlist)
user_Route.post('/removeWishlist',userController.productRemove)

user_Route.get('/wallet',userAuth.isLogin,userProfileController.loadWallet)
user_Route.post('/walletMoney',userAuth.isLogin,userProfileController.moneyAdding)
user_Route.post('/withdrawal',userAuth.isLogin,userProfileController.moneyWithdrw)

user_Route.get('/coupon',userAuth.isLogin,userProfileController.loadCoupon)
user_Route.post('/couponVerify',userAuth.isLogin,checkoutController.couponVerify)

user_Route.post('/razorpay',userAuth.isLogin,checkoutController.razorpayment)
user_Route.post('/repayment',userAuth.isLogin,checkoutController.repayment)

user_Route.get('/forgot',userController.loadForgotPage)
user_Route.post('/forgotPass',userController.verifyMail)
user_Route.get('/resetPassOtp',userController.loadResetPassOtp)
user_Route.post('/verifyResetPassOtp/:email',userController.verifyResetPassOtp)
user_Route.get('/resetPassword',userController.loadResetPassword)
user_Route.post('/verifyRePassword',userController.verifyRePassword)

// user_Route.get('*',(req,res)=>{
//     res.redirect('/')
// })
module.exports=user_Route
const express=require('express')
const admin_Route=express()
const adminController=require('../controllers/adminController')
const CategoryController=require('../controllers/categoryController')
const productController=require('../controllers/productController')
const adminAuth=require('../middleware/adminAuth')
const adminOrderController=require('../controllers/adminOrderController')

admin_Route.set('view engine','ejs')
admin_Route.set('views','./views/admin')

admin_Route.get('/', adminController.loadAdminLogin);
admin_Route.post('/adminLogin',adminAuth.isLogout,adminController.verifyadminLogin);
admin_Route.get('/adminlogout',adminAuth.isLogin,adminController.adminLogout)


admin_Route.get('/dashboard',adminAuth.isLogin,adminController.loadAdminDashboard);
admin_Route.get('/userlist',adminAuth.isLogin,adminController.loadUserlist)

admin_Route.get('/block',adminController.loadblock)
admin_Route.get('/list',CategoryController.loadcategoryListUnlist)
admin_Route.get('/unlist',productController.loadproductListUnlist)


admin_Route.get('/productlist',adminAuth.isLogin,productController.loadProductlist)
admin_Route.get('/addProduct',adminAuth.isLogin,productController.loadAddProduct)
admin_Route.post('/insertProduct',productController.insertProduct)
admin_Route.get('/productEdit',adminAuth.isLogin,productController.loadProductEdit)
admin_Route.post('/editProduct',adminAuth.isLogin,productController.productEditing)


admin_Route.get('/categoryList',adminAuth.isLogin,CategoryController.loadCategory)
admin_Route.get('/categoryAdd',adminAuth.isLogin,CategoryController.loadAddingCategory)
admin_Route.post('/addCategorys',CategoryController.addNewCategory)
admin_Route.get('/categoryEdit',adminAuth.isLogin,CategoryController.loadCategoryEdit)
admin_Route.post('/editCategory',CategoryController.categoryEditing)

admin_Route.get ('/ordersList',adminAuth.isLogin,adminOrderController.loadOrderList)
admin_Route.get('/orderDetailsList',adminAuth.isLogin,adminOrderController.loadOrderDetailList)
admin_Route.post('/statusChange',adminOrderController.changeStatus)
admin_Route.post('/returnApproved',adminOrderController.returnApproev)
admin_Route.post('/returnDeclined',adminOrderController.returnDecline)

admin_Route.get('/productOffer',adminAuth.isLogin,adminController.productOfferLoad)
admin_Route.post('/addOffer',adminAuth.isLogin,adminController.addProductOffer)
admin_Route.post('/changeStatus',adminController.offerStatus)
admin_Route.get('*',(req,res)=>{
    res.redirect('/admin/') 
})

module.exports=admin_Route
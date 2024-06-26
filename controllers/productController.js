const Product=require('../models/product_model')
const Category=require('../models/category_model')
const multer = require('multer')
const path=require('path')
const express=require('express')
const app=express()

const loadProductlist=async(req,res)=>{
    try {
        const productData=await Product.find().populate('category','name')
        let success=req.flash('success')
        res.render('productlist',{productData,success})
    } catch (error) {
        console.log(error);
    }
}
const loadAddProduct=async(req,res)=>{
    try {
        let errmsg=req.flash('errmsg')
        let success=req.flash('success')
        const categories=await Category.find({is_Listed:true})
        res.render('productadd',{categories,errmsg,success})
    } catch (error) {
        console.log(error);
    }
}


const imglocation=multer.diskStorage({
    destination:function(req,file,callback){
       callback(null,'public/IMAGES');
    },
    filename:function(req,file,callback){
         callback(null,Date.now()+'-'+file.originalname)
    }
})
const insert=multer({storage:imglocation}).fields([
    {name:'Inputimage',maxCount:4},
])
app.use(express.static(path.join(__dirname,'public')))


const insertProduct=async(req,res)=>{
    try {
        insert(req,res,async function(error){
            if(error){
                req.flash('errmsg','should not exceed 4 images')
                return res.redirect('/admin/addProduct')
            }
            const name=req.body.pname.trim().toUpperCase()
            const exist=await Product.findOne({name})
            if(exist){
                req.flash('errmsg','The product is already added')
                return res.redirect('/admin/addProduct')
            }
            const imageFile=req.files['Inputimage'];
            if(imageFile.length!==4){
                req.flash('errmsg','should be insert 4 image')
                return res.redirect('/admin/addProduct')
            }
            const Inputimage=imageFile.map(file=>({
                filename:file.filename,
                path:'/uploads'+file.filename
            }))
            const newProduct=new Product({
                name,
                price:req.body.price,
                quantity:req.body.quantity,
                category:req.body.category, 
                description:req.body.description,
                Inputimage,
            })
            await newProduct.save()
            req.flash('success','Product Adding Successfull')
            res.redirect('/admin/productlist')
        })
    } catch (error) {
        console.log(error,'error while adding product');
    }
} 

const loadproductListUnlist=async (req,res)=>{
    try {
        const productid=req.query.productid
        const productdata=await Product.findOne({_id:productid})
        const isDelete=productdata.is_delete
        if(isDelete==true){
            await Product.findByIdAndUpdate(productid,{$set:{is_delete:false}})
            return res.json({success:true})
        }else{
            await Product.findByIdAndUpdate(productid,{$set:{is_delete:true}})
            return res.json({success:true})

        }
    } catch (error) {
        console.log(error);
    }
} 
const loadProductEdit=async(req,res)=>{
    try {
        const id=req.query.productId
        const productDetail= await Product.findOne({_id:id})
        const categories=await Category.find({is_Listed:true})
        let success=req.flash('success')
        let errmsg=req.flash('errmsg')
        res.render('productedit',{success,errmsg,productDetail,categories})
    } catch (error) {
        console.log(error);
    }
}

const productEditing=async(req,res)=>{
    try {
        const productId=req.query.id;
        const products=await Product.find()
        const newName=req.body.name.toUpperCase()
        const productExists=products.some(product=>{
        return product.name.toUpperCase()===newName&&product._id.toString()!==productId
        })
        if(productExists){
            req.flash('errmsg','The Product Already Existed')
            res.redirect('/admin/productEdit')
        }else{
            const product = await Product.findById(productId);
            const imageFile=req.files['Inputimage'];
            if(imageFile.length!==4){
                req.flash('errmsg','should be insert 4 image')
                return res.redirect('/admin/addProduct')
            }
            const Inputimage=imageFile.map(file=>({
                filename:file.filename,
                path:'/uploads'+file.filename
            }))
            
            await Product.findByIdAndUpdate({_id:productId},
                {$set:{
                    name:newName,
                    price:req.body.price,
                    quantity:req.body.quantity,
                    category:req.body.category, 
                    description:req.body.description,
                    Inputimage
                }
            })
            req.flash('success','product updating successfull')
            return res.redirect('/admin/productList')
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports={
    loadProductlist,
    loadAddProduct,
    insertProduct,
    loadproductListUnlist,
    loadProductEdit,
    productEditing
}
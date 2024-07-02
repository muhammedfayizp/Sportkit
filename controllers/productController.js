
const Product=require('../models/product_model')
const Category=require('../models/category_model')
const multer = require('multer')
const path=require('path')
const express=require('express')
const { find, findById } = require('../models/cart_model')
const { response } = require('../Routes/userRoute')
const app=express()

const loadProductlist=async(req,res)=>{
    try {
        let productData=await Product.find().populate('category','name').populate('offers')
        productData=[...productData].reverse()
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


const imglocation = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/IMAGES');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const insert = multer({ storage: imglocation }).fields([
    { name: 'Inputimage', maxCount: 4 },
]);

app.use(express.static(path.join(__dirname, 'public')));



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
            req.flash('success','Product Added Successfully')
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
const imageRemove = async (req, res) => {
    try {
        const { productId, index } = req.body;

        console.log('Received productId:', productId);
        console.log('Received index:', index);

        let product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        product.Inputimage.splice(index, 1);

        await product.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error removing image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// const productEditing = async (req, res) => {
//     try {
//         const productId = req.query.id;
//         const { name, price, quantity, category, description } = req.body;

//         if (!category || category === "") {
//             req.flash('errmsg', 'Please select a valid category.');
//             return res.redirect(`/admin/editProduct?id=${productId}`);
//         }

//         let existProduct = await Product.findById(productId);
//         let imageFiles = req.body.Inputimage;
//         console.log('im'+imageFiles);

//         existProduct.name = name;
//         existProduct.price = price;
//         existProduct.quantity = quantity;
//         existProduct.category = category;
//         existProduct.description = description;

    

//         if (imageFiles && imageFiles.length > 0) {
//             let newImages = imageFiles.map(file => ({
//                 filename: file.filename,
//                 path: '/uploads/' + file.filename
//             }));
//             existProduct.Inputimage = [...newImages];
//             console.log('inp'+newImages);
//             console.log('ex'+existProduct.Inputimage);
//         }
//         await existProduct.save();

//         req.flash('success', 'Product updating successful');
//         res.redirect('/admin/productlist');
//     } catch (error) {
//         console.error(error);
//     }
// };


const productEditing = async (req, res) => {
    try {
        const productId = req.query.id;
        const { name, price, quantity, category, description } = req.body;

        if (!category || category === "") {
            req.flash('errmsg', 'Please select a valid category.');
            return res.redirect(`/admin/editProduct?id=${productId}`);
        }

        let existProduct = await Product.findById(productId);

        // Update product details
        existProduct.name = name;
        existProduct.price = price;
        existProduct.quantity = quantity;
        existProduct.category = category;
        existProduct.description = description;

        // Handle image updates
        if (req.files && req.files.length > 0) {
            let newImages = req.files.map(file => ({
                filename: file.filename,
                path: '/uploads/' + file.filename
            }));
            existProduct.Inputimage = [...newImages];
        }

        // Save updated product
        await existProduct.save();

        req.flash('success', 'Product updating successful');
        res.redirect('/admin/productlist');
    } catch (error) {
        console.error(error);
        req.flash('errmsg', 'Failed to update product');
        res.redirect(`/admin/editProduct?id=${productId}`);
    }
};





module.exports={
    loadProductlist,
    loadAddProduct,
    insertProduct,
    loadproductListUnlist,
    loadProductEdit,
    productEditing,
    imageRemove
}
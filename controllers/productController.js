
const Product=require('../models/product_model')
const Category=require('../models/category_model')
const multer = require('multer')
const path=require('path')
const express=require('express')
const { find, findById } = require('../models/cart_model')
const { response } = require('../Routes/userRoute')
const app=express()

const loadProductlist = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = 8; 
        const skip = (page - 1) * limit; 

        const totalProducts = await Product.countDocuments(); 
        const totalPages = Math.ceil(totalProducts / limit);

        let productData = await Product.find().populate('category', 'name').populate('offers').skip(skip).limit(limit);

        let success = req.flash('success');
        
        res.render('productlist', {productData,success,currentPage: page,totalPages});
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


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/IMAGES');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).array('Inputimage', 10);

const productEditing = async (req, res) => {
    try {
        upload(req, res, async function (error) {
            if (error) {
                return res.json({ success: false, message: 'Image upload failed' });
            }
                
            const productId = req.query.id;
            let { name, price, quantity, category, description, removedImages } = req.body;

            if (!category || category === "") {
                req.flash('errmsg', 'Please select a valid category.');
                return res.redirect(`/admin/editProduct?id=${productId}`);
            }

            let existingProduct = await Product.findById(productId);

            if (existingProduct.Inputimage.length < 4) {
                res.json({ success: false, message: 'Maximum of 4 images allowed.' });
            }

            existingProduct.name = name;
            existingProduct.price = price;
            existingProduct.quantity = quantity;
            existingProduct.category = category;
            existingProduct.description = description;

            let imagesRemoved = false;
            if (imagesRemoved && (!req.files || req.files.length === 0)) {
                return res.json({ success: false, message: 'Please add at least one new image after removing an existing one.' });
            }

            if (removedImages) {
                const removedImageIndexes = JSON.parse(removedImages);
                removedImageIndexes.forEach(index => {
                    existingProduct.Inputimage.splice(index, 1);
                });
                imagesRemoved = removedImageIndexes.length > 0;
            }

            
            if (req.files && req.files.length > 0) {
                const newImages = req.files.map(file => ({
                    filename: file.filename,
                    path: '/IMAGES/' + file.filename
                }));
                if (existingProduct.Inputimage.length + newImages.length > 4) {
                    return res.json({ success: false, message: 'Maximum of 4 images allowed.' });
                }
                existingProduct.Inputimage.push(...newImages);
            }

            await existingProduct.save();
            res.json({ success: true });
        });
    } catch (error) {
        console.error('Error:', error);
    }
};


module.exports={
    loadProductlist,
    loadAddProduct,
    insertProduct,
    loadproductListUnlist,
    loadProductEdit,
    productEditing,
}
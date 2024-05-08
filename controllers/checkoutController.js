const User = require('../models/user_model')
const Category = require('../models/category_model')
const Product = require('../models/product_model')
const Cart = require('../models/cart_model')

const loadCheckout=async(req,res)=>{
    try {
        res.render('checkout')
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadCheckout
}
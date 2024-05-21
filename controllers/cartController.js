const User = require('../models/user_model')
const Category = require('../models/category_model')
const Product = require('../models/product_model')
const Cart = require('../models/cart_model')


const loadCart = async (req, res) => {
    try {
        const user = req.session.user
        const userData = await User.findOne({ _id: user })
        const populateCart = await Cart.findOne({ UserId: user }).populate({
            path: 'products.productId',
            model: 'Product'
          }).exec();
        const cartData = populateCart.products;
          const totalCartPrice = populateCart.cartTotal;
          res.render('cart', {userData,cartData, totalCartPrice, cartId: populateCart._id });
           
    } catch (error) {
        console.log(error);
    }
}

const productaddingtocart = async (req, res) => {
    try {
        if (req.session.user) {
            const productId = req.query.productId;
            const quantity = req.query.quantity
            const userId = req.session.user;
            const userCart = await Cart.findOne({UserId:userId})
            const product = await Product.findById(productId)
        if (!userCart) {
            const productPrice = quantity * product.price;
            const cart = new Cart({
                UserId: userId,
                products: [
                    {
                        productId: product._id,
                        quantity: quantity,
                        price: product.price,
                        totalAmount: productPrice
                    }
                ],
                cartTotal: productPrice
            });
            cart.cartTotal = cart.products.reduce(
                (accu, curr) => (accu = curr.totalAmount), 0
            )
            await cart.save()
            res.json({ success: true })
        }
        const exist = userCart.products.find((products) => String(products.productId) == productId)
        if(exist){
            exist.quantity+=parseInt(quantity);
            exist.totalAmount=exist.quantity*product.price;
        }else{
            const productPrice=quantity*product.price
            userCart.products.push({
                productId:product._id,
                quantity:quantity,
                price:product.price,
                totalAmount:productPrice
            })
        }
        userCart.cartTotal=userCart.products.reduce(
            (accu,curr)=>accu+curr.totalAmount,0
        )
        await userCart.save()
        res.json({success:true})
    }
    } catch (error) {
        console.log(error);
    }
}


const quantityUpdate = async (req, res) => {
    try {
        const { productId, newQuantity } = req.body;
        const userId = req.session.user;
        const cart = await Cart.findOne({ UserId: userId });
        const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
        if (productIndex!== -1) {
            cart.products[productIndex].quantity = newQuantity;
            cart.products[productIndex].totalAmount = newQuantity * cart.products[productIndex].price;
            cart.cartTotal = cart.products.reduce((total, product) => total + product.totalAmount, 0);
            await cart.save();
            res.json({ productId, totalPrice: cart.products[productIndex].totalAmount, cartTotal: cart.cartTotal });
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const removeProduct=async(req,res)=>{
    try {
        const userId=req.session.user
        const userData = await Cart.findOne({ UserId: userId });
        const {productId}=req.query
        const productRemoveing=await Cart.findOneAndUpdate({UserId:userId},{$pull:{products:{productId:productId}}})
        if(productRemoveing){
            
            return res.json({success:true})
        }else{
            return res.json({success:false})
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    loadCart,
    productaddingtocart,
    quantityUpdate,
    removeProduct
}
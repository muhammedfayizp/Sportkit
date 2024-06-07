const User = require('../models/user_model')
const Category = require('../models/category_model')
const Product = require('../models/product_model')
const Cart = require('../models/cart_model')


const loadCart = async (req, res) => {
    try {
        const user = req.session.user
        const userData = await User.findOne({ _id: user })
        const categories = await Category.find({ is_Listed: true })

        const populateCart = await Cart.findOne({ UserId: user }).populate('products.productId')
        if (!populateCart) {
            res.render('cart', { userData, cartData: [], totalCartPrice: 0, cartId: null, categories });
            return;
        }
        const cartData = populateCart.products;
        const totalCartPrice = populateCart.cartTotal;
        res.render('cart', { userData, cartData, totalCartPrice, cartId: populateCart._id, categories });

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
            const userCart = await Cart.findOne({ UserId: userId })
            const product = await Product.findById(productId)
            if (!userCart) {
                const productPrice = quantity * product.finalPrice;
                const cart = new Cart({
                    UserId: userId,
                    products: [
                        {
                            productId: product._id,
                            quantity: quantity,
                            price: product.finalPrice,
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
            if (exist) {
                exist.quantity += parseInt(quantity);
                exist.totalAmount = exist.quantity * product.finalPrice;
            } else {
                const productPrice = quantity * product.finalPrice
                userCart.products.push({
                    productId: product._id,
                    quantity: quantity,
                    price: product.finalPrice,
                    totalAmount: productPrice
                })
            }
            userCart.cartTotal = userCart.products.reduce(
                (accu, curr) => accu + curr.totalAmount, 0
            )
            await userCart.save()
            res.json({ success: true })
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
        if (productIndex !== -1) {
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

const removeProduct = async (req, res) => {
    try {
        const userId = req.session.user;
        const { productId } = req.query;
        const userData = await Cart.findOne({ UserId: userId });
        if (userData && userData.products) {
            const productToRemove = userData.products.find(product => product.productId.toString() === productId);

            if (productToRemove) {
                const updatedProducts = userData.products.filter(product => product.productId.toString() !== productId);
                const updatedTotalPrice = userData.cartTotal - (productToRemove.price * productToRemove.quantity);

                const updatedCart = await Cart.findOneAndUpdate(
                    { UserId: userId },
                    {
                        $set: {
                            products: updatedProducts,
                            cartTotal: updatedTotalPrice
                        }
                    },
                    { new: true }
                );

                return res.json({ success: true, cart: updatedCart });
            } else {
                return res.json({ success: false, message: 'Product not found in cart' });
            }

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
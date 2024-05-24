const User = require('../models/user_model')
const Category = require('../models/category_model')
const Product = require('../models/product_model')
const Cart = require('../models/cart_model')
const Address=require('../models/userAddress_model')
const Order=require('../models/order_model')

const loadCheckout=async(req,res)=>{
    try {
        const errormsg=req.flash('errormsg')
        const userId=req.session.user
        const userData = await User.findOne({ _id: userId })
        const cartData=await Cart.findOne({UserId:userId})
        const categories=await Category.find({is_Listed:true})
        const addressData=await Address.findOne({UserId:userId})
        res.render('checkout',{userData,cartData,addressData,errormsg,categories})
    } catch (error) {
        console.log(error);
    }
}

const addressnewAdding = async (req, res) => {
    try {

        const { Name, Email, Mobile, Pincode, State, District, City, houseAddress, houseNumber } = req.body
        const userId = req.session.user
        const userData = await Address.findOne({ UserId: userId })
        if (userData) {
            userData.address.push({
                name: Name,
                email: Email,
                mobile: Mobile,
                pincode: Pincode,
                state: State,
                dist: District,
                city: City,
                houseName: houseAddress,
                houseNo: houseNumber
            })
            await userData.save()
            res.redirect('/checkout')
        } else {
            const addingAddress = new Address({
                UserId: userId,
                address: [{
                    name: Name,
                    email: Email,
                    mobile: Mobile,
                    pincode: Pincode,
                    state: State,
                    dist: District,
                    city: City,
                    houseName: houseAddress,
                    houseNo: houseNumber
                }]
            })
            await addingAddress.save()
            res.redirect('/checkout')
        }
    } catch (error) {
        console.log(error);
    }
}

const loadEditAddress = async (req, res) => {
    try {
        const user = req.session.user;
        const userData = await User.findOne({ _id: user });
        const categories=await Category.find({is_Listed:true})
        const addressId = req.query.addressId;
        const addressData = await Address.findOne({ 'address._id': addressId, UserId: user });
        const address = addressData.address.find(addr => addr._id.toString() === addressId);
        if (!address) {
            return res.status(404).send("Address not found");
        }
        res.render('checkoutAddressEdit', { userData, addressData: address,categories});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const checkoutAddressEdit = async (req, res) => {
    try {
        const { Name, Mobile, Pincode, State, District, City, houseAddress, houseNumber } = req.body;
        const addressId = req.query.addressId;
        const user = req.session.user;

        const addressData = await Address.findOne({ UserId: user, 'address._id': addressId });

        if (!addressData) {
            return res.status(404).send("Address data not found");
        }

        const foundAddress = addressData.address.findIndex(ads => ads._id.toString() === addressId);
        if (foundAddress === -1) {
            return res.status(404).send("Address not found");
        }

        const updateResult = await Address.updateOne(
            { UserId: user, 'address._id': addressId },
            {
                $set: {
                    'address.$.name': Name,
                    'address.$.mobile': Mobile,
                    'address.$.pincode': Pincode,
                    'address.$.state': State,
                    'address.$.dist': District,
                    'address.$.city': City,
                    'address.$.houseName': houseAddress,
                    'address.$.houseNo': houseNumber
                }
            }
        );

        res.redirect('/checkout');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


const checkStockInCart=async(req,res)=>{
    try {
        const userId=req.session.user
        const cartData=await Cart.findOne({UserId:userId}).populate('products','productId')
        let outOfStock=[]
        if(cartData){
        for(let item of cartData.products){
            const product=item.productId;
            if(product.quantity<=0){
                outOfStock.push(product.name)
            }
        }
        const cartProduct=cartData.products
        if(cartProduct.length<=0){
            res.status(400).json({success:false, message:'your cart have no product'})
        }else if(outOfStock.length>0){
            res.status(400).json({success:false,message:'product is out of stock'})
        }else{
            res.json({success:true})
        }
        }
    } catch (error) {
        console.log(error);
    }
}

function orderIdgenerate(){
    const minimum=10000000000
    const maximum=99999999999
    return Math.floor(Math.random()*(maximum-minimum+1))+minimum
}
 
const placeOrder = async (req, res) => {
    try {
        const userId = req.session.user;
        const { paymentMethodType, addressId } = req.body;

        if (!addressId) {
            req.flash('errormsg', 'please select an address');
            return res.redirect('/checkout');
        }

        const addressData = await Address.findOne({'address._id': addressId});
        const addressDetails = addressData.address.find(address => address._id.equals(addressId));
        if (!addressDetails) {
            req.flash('errormsg', 'Address not found');
            return res.redirect('/checkout');
        }

        const cartData = await Cart.findOne({ UserId: userId });
        if (!cartData || !Array.isArray(cartData.products)) {
            return res.status(400).json({ message: "Cart not found or items are undefined" });
        }

        const orderId = orderIdgenerate(); 
        const newOrder = new Order({
            UserId: userId,
            items: cartData.products.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                status: 'Confirmed',
                reason: '',
                price: item.price,
                // categoryId: item.categoryId,
            })),
            totalAmount: cartData.cartTotal,
            addressDetails: {
                name: addressDetails.name,
                mobile: addressDetails.mobile,
                pincode: addressDetails.pincode,
                state: addressDetails.state,
                dist: addressDetails.dist,
                city: addressDetails.city,
                houseName: addressDetails.houseAddress,
                houseNo: addressDetails.houseNo
            },
            PaymentMethod: paymentMethodType,
            orderId: orderId,
            currentDate: new Date()
        });

        await newOrder.save();
        await Cart.findOneAndUpdate({ UserId: userId }, { $set: { cartTotal: 0, products: [] } });
        res.json({ success: true });

        for (let item of cartData.products) {
            const eachProduct = await Product.findById(item.productId);
            if (eachProduct) {
                eachProduct.quantity -= item.quantity;
                await eachProduct.save();
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





module.exports = {
    loadCheckout,
    addressnewAdding,
    loadEditAddress,
    checkoutAddressEdit,
    checkStockInCart,
    placeOrder
}
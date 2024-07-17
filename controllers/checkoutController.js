const User = require('../models/user_model')
const Category = require('../models/category_model')
const Product = require('../models/product_model')
const Cart = require('../models/cart_model')
const Address=require('../models/userAddress_model')
const Order=require('../models/order_model')
const Wallet=require('../models/wallet-model')
const Coupon=require('../models/coupon_model')
const razorpay=require('razorpay')

require("dotenv").config();
const instance = new razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


const loadCheckout=async(req,res)=>{
    try {
        let errormsg = req.flash('errormsg')
        const userId=req.session.user
        const userData = await User.findOne({ _id: userId })
        const populateCart = await Cart.findOne({ UserId: userId }).populate('products.productId')
        const categories=await Category.find({is_Listed:true})
        const addressData=await Address.findOne({UserId:userId})
        const cp=await User.findOne({_id:userId}).populate('coupon');
        const coupons=cp.coupon
        const totalCartPrice = populateCart.cartTotal;
        const cartData = populateCart ? populateCart.products : [];
        const discount=req.session.discount
        const discountAmount=req.session.discountAmount
        if(totalCartPrice<2500){
            populateCart.deliveryCharge=40
        }else{
            populateCart.deliveryCharge=0
        }
        await populateCart.save()
        res.render('checkout',{userData,cartData,totalCartPrice,addressData,errormsg,categories,discount,discountAmount,deliveryCharge: populateCart.deliveryCharge,coupons})
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
        const { paymentMethodType, addressId ,status} = req.body;
        const couponId=req.session.couponId
        const discountAmount=req.session.discountAmount
        
        if (!addressId) {
            req.flash('errormsg', 'Please select an address');
            return res.redirect('/checkout');
        }

        const cartData = await Cart.findOne({ UserId: userId });
        const addressData = await Address.findOne({ 'address._id': addressId });
        const walletData = await Wallet.findOne({ UserId: userId });
        const addressDetails = addressData.address.find(address => address._id.equals(addressId));
        const cpId=await Coupon.findOne({couponId})


        const orderId = orderIdgenerate();
        const newOrder = new Order({
            UserId: userId,
            items: cartData.products.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                status: 'Confirmed',
                reason: '',
                price: item.price,
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
            discount:discountAmount,
            currentDate: new Date(),
            paymentStatus:status
        });

        if(newOrder.totalAmount<2500){
            newOrder.totalAmount+=cartData.deliveryCharge
        }

        const firstOrder=await Order.findOne({UserId:userId})
        const userData=await User.findById(userId)
        const refCode=userData.referred

        if(refCode&&firstOrder==undefined){
            const referralUser=await User.findOne({
                referral:refCode
            })
            const refUserWallet=await Wallet.findOne({UserId:referralUser._id})
            if(refUserWallet){
                refUserWallet.balance+=30
                refUserWallet.history.push({
                    amount: 30,
                    method: 'Referral',
                    transactionType: 'credit',
                    currentAmount: refUserWallet.balance
                })
            }else{
                const walletAddMoney=new Wallet({
                    UserId:referralUser._id,
                    balance:30,
                    history: [{
                        amount: 30,
                        transactionType: 'credit',
                        method: 'Referral',
                        currentAmount: 30   
                    }]
                })
                await walletAddMoney.save()
            }
        }

        
        if (paymentMethodType === 'cash-on-delivery') {
            if(cartData.cartTotal>2500){
                res.json({success:false,message:'not_available'})
            }else{

            await newOrder.save();
            await eligibleforCoupon(userId,cartData.cartTotal)
            await discountRemoveing(req)
            await Cart.findOneAndUpdate({UserId:userId},{$set: {cartTotal:0,products:[]}});
            await User.findOneAndUpdate({_id:userId},{$pull:{coupon:couponId}});
            req.session.couponId=null
            res.json({success:true});
        }
        } else if (paymentMethodType === 'Wallet') {
            if (!walletData) {
                return res.json({ success: false, message: 'no_wallet' });
            } else if (cartData.cartTotal > walletData.balance) {
                return res.json({ success: false, message: 'insufficient_balance' });
            } 
                const withdrawalAmount = cartData.cartTotal;
                walletData.balance -= cartData.cartTotal;
                walletData.history.push({
                    amount: withdrawalAmount,
                    method: 'Purchase',
                    transactionType: 'debit',
                    currentAmount: walletData.balance
                });
                await walletData.save();
                await newOrder.save();
                await eligibleforCoupon(userId,cartData.cartTotal)
                await discountRemoveing(req)
                await Cart.findOneAndUpdate({ UserId: userId }, { $set: { cartTotal: 0, products: [] } });
                await User.findOneAndUpdate({ _id: userId }, { $pull: { coupon: couponId } });
                req.session.couponId=null
                res.json({ success: true });
            
        }else if(paymentMethodType==='online-payment'){
            await newOrder.save();
            await eligibleforCoupon(userId,cartData.cartTotal)
            await discountRemoveing(req)
            await Cart.findOneAndUpdate({ UserId: userId }, { $set: { cartTotal: 0, products: [] } });
            await User.findOneAndUpdate({ _id: userId }, { $pull: { coupon: couponId } });
            req.session.couponId=null
            if (status === 'Failed') {
                return res.json({ success: false, message: 'your payment failed' });
            } else {
                return res.json({ success: true, message: 'Your order was placed successfully!' });
            }
        }
        for (let item of cartData.products) {
            const eachProduct = await Product.findById(item.productId);
            await Product.updateOne({_id:item.productId},{$inc:{quantity:-item.quantity,soldProductCount:+item.quantity}})
            await Category.updateOne({_id:eachProduct.category},{$inc:{soldCount:+item.quantity}})
        }
    } catch (error) {
        console.error(error);
    }
};


const razorpayment = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.session.user });
        const amount = req.body.cartTotal;

        const options = {
            amount: amount,
            currency: "INR",
            receipt: "receipt#1"
        };

        instance.orders.create(options, (err, order) => {
            if (!err) {
                res.send({
                    success: true,
                    msg: "ORDER created",
                    orderid: order.id,
                    amount: amount,
                    key_id: process.env.RAZORPAY_ID,
                    name: userData.name,
                    email: userData.email
                });
            } else {
                console.error("Error creating order:", err);
                res.status(500).send({ success: false, msg: "Failed to create order" });
            }
        });
    } catch (error) {
        console.log("error from razopay:", error.message);
        res.status(500).send({ success: false, msg: "Server error" });
    }
};
const eligibleforCoupon = async (userId, cartTotal) => {
    try {
        const couponData = await Coupon.find({is_active:true}).sort({minimumPrice:-1});
        const userData = await User.findById(userId);
        let maxDictCoupon

        for (const coupon of couponData) {
            if (!userData.coupon.includes(coupon._id)&&cartTotal>= coupon.minimumPrice) {
                if (!maxDictCoupon || coupon.discount>maxDictCoupon.discount) {
                    maxDictCoupon=coupon;
                }
            }
        }
        if (maxDictCoupon) {
            await User.findByIdAndUpdate({_id:userId},{$push:{coupon:maxDictCoupon._id}});
        }
    } catch (error) {
        console.log(error);
    }
}

const repayment=async(req,res)=>{
    try {
        const {orderId , status } =req.body
        
        console.log('oderId'+orderId,'statusd'+status);
        await Order.findOneAndUpdate({orderId:orderId},{paymentStatus:'Success'})
        res.json({success:true})

    } catch (error) {
        console.log(error);
    }
}


const discountRemoveing=async(req,res)=>{
    delete req.session.discountAmount;
    delete req.session.discount;
}

const couponVerify = async (req, res) => {
    try {
        const userId = req.session.user;
        const {couponNumber} = req.body;
        let couponCode = Number(couponNumber);        
        const cartData=await Cart.findOne({UserId:userId});
        const userData=await User.findById(userId).populate('coupon');

        let couponMatch=false;
        let discount=0;
        let discountAmount=0;
        let couponId=null;
        
        for (let coupon of userData.coupon) {
            if (coupon.couponCode===couponCode) {
                couponMatch=true;
                discount=coupon.discount;
                couponId=coupon._id;
                break;
            }
        }

        if (couponMatch) {
            discountAmount=Math.floor((cartData.cartTotal*discount)/100);
            const cartTotal=cartData.cartTotal-discountAmount;
            cartData.cartTotal=cartTotal;
            await cartData.save();
            
            req.session.discount=discount;
            req.session.discountAmount=discountAmount;
            req.session.couponId=couponId;
            res.json({success:true,discount:discount});
        }else{
            res.json({success:false});
        }
    }catch(error) {
        console.log(error);
    }
};




module.exports = {
    loadCheckout,
    addressnewAdding,
    loadEditAddress,
    checkoutAddressEdit,
    checkStockInCart,
    placeOrder,
    couponVerify,
    razorpayment,
    repayment
}
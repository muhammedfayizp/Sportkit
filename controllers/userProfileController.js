const User = require('../models/user_model')
const Address = require('../models/userAddress_model')
const bcrypt = require('bcrypt')
const Category=require('../models/category_model')
const Product=require('../models/product_model')
const Cart=require('../models/cart_model')
const Order=require('../models/order_model')
const Wallet=require('../models/wallet-model')
const Coupon=require('../models/coupon_model')

const securePassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword
    } catch (error) {
        console.log(error);
    }
}


const loadUserProfile = async (req, res) => {
    try {
        const user = req.session.user
        const categories=await Category.find({is_Listed:true})
        const products=await Product.find({is_delete:true})

        if (user) {
            const userData = await User.findById(user)

            if (!userData.is_verified) {
                req.session.user = null
                res.redirect('/login')
            } else {

                res.render('userProfile', { userData,categories,baseUrl: process.env.BASE_URL})
            }

        } else {
            res.render('userProfile', { products,categories,baseUrl: process.env.BASE_URL})
        }

    } catch (error) {
        console.log(error);
    }
}
const loadUserPasChange = async (req, res) => {
    try {
        const user = req.session.user
        const userData = await User.findById({ _id: user })
        const categories=await Category.find({is_Listed:true})

        let errmsg = req.flash('errmsg')
        res.render('profilePasswordChange', { userData, errmsg,categories})
    } catch (error) {
        console.log(error);
    }
}

const userProfileEdit = async (req, res) => {
    try {

        const userId = req.session.user
        const { newName, newMobile } = req.body
        const editUserProfile = await User.findByIdAndUpdate(userId, { name: newName, mobile: newMobile });

        if (editUserProfile) {
            res.json({ success: true, message: 'sdhfbwjfbnsdjfh' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "zkjbkbfsdb" })
    }
}

const verifyPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const userId = req.session.user
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'user not found' })
        }
        const spassword = await bcrypt.hash(newPassword, 10)
        const changingPassword = await User.findByIdAndUpdate(userId, { password: spassword })
        if (changingPassword) {
            res.redirect('/userProfile')
            return res.json({ success: true })
        }
        else {
            return res.json({ success: false })
        }

    } catch (error) {
        console.log(error);
    }
}

const loadAddress = async (req, res) => {
    try {
        const user = req.session.user
        const userData = await User.findOne({ _id: user })
        const addressData = await Address.findOne({ UserId: user })
        const categories=await Category.find({is_Listed:true})

        res.render('address', { userData, addressData,categories})
    } catch (error) {
        console.log(error);
    }
}

const addressAdding = async (req, res) => {
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
            res.redirect('/addressList')
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
            res.redirect('/addressList')
        }
    } catch (error) {
        console.log(error);
    }
}

const Addressdelete = async (req, res) => {
    try {

        const userId = req.session.user
        const { addressId } = req.body
        const addressRemoving = await Address.findOneAndUpdate({ UserId: userId }, { $pull: { address: { _id: addressId } } });
        if (addressRemoving) {
            return res.json({ success: true })
        } else {
            return res.json({ success: false })
        }
    } catch (error) {
        console.log(error);
    }
}

const loadProfileEditAddress = async (req, res) => {
    try {
        const user = req.session.user;
        const userData = await User.findOne({ _id: user });
        const categories=await Category.find({is_Listed:true})

        const addressId = req.query.addressId;
        const addressData = await Address.findOne({ 'address._id': addressId, UserId: user });
        if (!addressData) {
            return
        }
        const address = addressData.address.find(addr => addr._id.toString() === addressId);
        if (!address) {
            return 
        }
        res.render('editAddress', { userData, address,categories});
    } catch (error) {
        console.log(error);
    }
};

const AddressEdit = async (req, res) => {
    try {
        const { Name, Mobile, Pincode, State, District, City, houseAddress, houseNumber } = req.body;
        const addressId = req.query.addressId;
        const user = req.session.user;
        const addressData = await Address.findOne({ UserId: user, 'address._id': addressId });
        if (!addressData) {
            return 
        }
        const foundAddress = addressData.address.find(ads => ads._id.toString() === addressId);
        if (!foundAddress) {
            return 
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

        res.redirect('/addressList');
    } catch (error) {
        console.log(error);
    }
};



const loadOrderHistory = async (req, res) => {
    try {
        const userId = req.session.user;
        const userData = await User.findOne({ _id: userId });
        const categories = await Category.find({ is_Listed: true });

        const page = parseInt(req.query.page) || 1;
        const limit = 2; 
        const skip = (page - 1) * limit; 

        const count = await Order.countDocuments({ UserId: userId });
        const totalPages = Math.ceil(count / limit);

        const prevPage = page > 1 ? page - 1 : 1;
        const nextPage = page < totalPages ? page + 1 : totalPages;

        const orders = await Order.find({ UserId: userId }).populate('items.productId').sort({ currentDate: -1 }).skip(skip).limit(limit);

        res.render('orderHistory', {userData,categories,orders,totalPages,prevPage,nextPage,currentPage: page});
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
};
const loadOrderDetails = async (req, res) => {
    try {
        const userId = req.session.user;
        const orderId = req.query.orderId;
        const userData = await User.findOne({ _id: userId });
        const categories = await Category.find({ is_Listed: true });
        const orders = await Order.find({ UserId: userId, _id: orderId }).populate('items.productId')
        const cartData=await Cart.findOne({UserId:userId})

        res.render('orderDetails', { userData, categories, orders, cartData });
    } catch (error) {
        console.log(error);
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { orderId, productId } = req.body;
        const userId = req.session.user;
        const walletData = await Wallet.findOne({ UserId: userId });
        const order = await Order.findOne({ _id: orderId, 'items.productId': productId }).populate('items');

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        const item = order.items.find(item => item.productId.toString() === productId);
        
        item.status = 'Cancelled';

        if (order.discount) {
            let discountPrice = order.discount;
            console.log('discAmo' + discountPrice);
            let dis = Math.floor(discountPrice / order.items.length);
            console.log('divided price' + dis);
            order.totalAmount -= dis;
        }

        if (order.PaymentMethod !== 'cash-on-delivery') {
            if (!walletData) {
                const walletMoney = new Wallet({
                    UserId: userId,
                    balance: order.totalAmount,
                    history: [{
                        amount: order.totalAmount,
                        transactionType: 'credit',
                        method: 'Order Cancelled',
                        currentAmount: order.totalAmount
                    }]
                });
                await walletMoney.save();
            } else {
                walletData.balance += order.totalAmount;
                walletData.history.push({
                    amount: order.totalAmount,
                    transactionType: 'credit',
                    method: 'Order Cancelled',
                    currentAmount: walletData.balance
                });
                await walletData.save();
            }
        }

        const productData = await Product.findById(item.productId);
        productData.quantity += item.quantity;
        order.totalAmount -= item.price;
        await order.save();
        await productData.save();
        
        return res.json({ success: true, message: 'Order cancelled successfully' });
    } catch (error) {
        console.error(error);
    }
};


const returnOrder=async(req,res)=>{
    try {
        const returnData=req.body
        console.log(returnData);
        const order=await Order.findById(returnData.orderId)
        if(!order){
            return res.status(404).json({success:false,message:'order not found'})
        }
        const product=order.items.find(item=>item.productId.toString()===returnData.productId)
        if(product){
            product.reason=returnData.reason
        }
        order.approvel=1
        
        await order.save()  
        res.json({success:true})
    } catch (error) {
        console.log(error);
    }
}
const loadWallet=async(req,res)=>{
    try {
        const userId=req.session.user
        const userData=await User.findOne({_id:userId})
        const categories=await Category.find({is_Listed:true})
        const walletData=await Wallet.findOne({UserId:userId})
        let reverse=[]
        if(walletData){
            reverse=[...walletData.history].reverse()
        }
        const successmsg=req.flash('successmsg')
        let errormsg = req.flash('errormsg')


        res.render('wallet',{userData,categories,successmsg,walletData,reverse,errormsg})
    } catch (error) {
        console.log(error);
    }
}

const moneyAdding=async(req,res)=>{
    try {
       const userId=req.session.user
       const {addamount,'payment-method': paymentMethod}=req.body 
       const amount = Number(addamount)
       const walletData=await Wallet.findOne({UserId:userId})
       if(!walletData){
            const addingWalletMoney=new Wallet({
                UserId:userId,
                balance:amount,
                history:[{
                    amount:amount,
                    transactionType:'credit',
                    method:paymentMethod,
                    previousAmount:0,
                    currentAmount:amount
                }]
            })
            await addingWalletMoney.save()
            req.flash('successmsg','your wallet money successfully added')
            res.redirect('/wallet')
       }else{
        const previousAmount=walletData.balance
        walletData.balance+=amount
        walletData.history.push({
            amount:amount,
            method:paymentMethod,
            transactionType:'credit',
            previousAmount,
            currentAmount:walletData.balance
        })
        await walletData.save()
        req.flash('successmsg','your wallet money successfully added')
        res.redirect('/wallet')

       }
    } catch (error) {
        console.log(error);
    }
}

const moneyWithdrw=async(req,res)=>{
    try {
        const userId=req.session.user
        const {withdrwAmount}=req.body
        const withdrawalAmount=Number(withdrwAmount)
        const walletData=await Wallet.findOne({UserId:userId})
        if(walletData.balance<withdrawalAmount){
            req.flash('errormsg','insufficient Balance')
            res.redirect('/wallet')
        }else{
            const previousAmount=walletData.balance
            walletData.balance-=withdrawalAmount
            walletData.history.push({
                amount:withdrawalAmount,
                method:'Bank Transfer',
                transactionType:'debit',
                previousAmount,
                currentAmount:walletData.balance
            })
            await walletData.save()
            req.flash('successmsg','your wallet money withdrawal successfull')
            res.redirect('/wallet')
        }

    } catch (error) {
        console.log(error);
    }
}

const loadCoupon = async (req, res) => {
    try {
        const userId = req.session.user;
        const page = parseInt(req.query.page) || 1; 
        const couponsPerPage = 6; 

        const userData = await User.findOne({ _id: userId }).populate('coupon');
        let couponData = userData.coupon;

        const totalCoupons = couponData.length;
        const totalPages = Math.ceil(totalCoupons / couponsPerPage);

        const coupons = couponData.slice((page - 1) * couponsPerPage, page * couponsPerPage);

        const categories = await Category.find({ is_Listed: true });
        res.render('coupon', {
            categories,
            userData,
            coupons,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.log(error);
    }
};



module.exports = {
    securePassword,
    loadUserProfile,
    loadUserPasChange,
    verifyPassword,
    loadAddress,
    userProfileEdit,
    addressAdding,
    Addressdelete,
    AddressEdit,
    loadProfileEditAddress,
    loadOrderHistory,
    loadOrderDetails,
    cancelOrder,
    returnOrder,
    moneyAdding,
    loadWallet,
    moneyWithdrw,
    loadCoupon
}

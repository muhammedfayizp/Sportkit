const User = require('../models/user_model')
const Address = require('../models/userAddress_model')
const bcrypt = require('bcrypt')
const Category=require('../models/category_model')
const Product=require('../models/product_model')
const Cart=require('../models/cart_model')
const Order=require('../models/order_model')

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

                res.render('userProfile', { userData,categories})
            }

        } else {
            res.render('userProfile', { products,categories})
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
            return res.status(404).send("Address data not found");
        }
        const address = addressData.address.find(addr => addr._id.toString() === addressId);
        if (!address) {
            return res.status(404).send("Address not found");
        }
        res.render('editAddress', { userData, address,categories});
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const AddressEdit = async (req, res) => {
    try {
        const { Name, Mobile, Pincode, State, District, City, houseAddress, houseNumber } = req.body;
        const addressId = req.query.addressId;
        const user = req.session.user;
        const addressData = await Address.findOne({ UserId: user, 'address._id': addressId });
        if (!addressData) {
            return res.status(404).send("Address data not found");
        }
        const foundAddress = addressData.address.find(ads => ads._id.toString() === addressId);
        if (!foundAddress) {
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

        res.redirect('/addressList');
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

const loadOrderHistory = async (req, res) => {
    try {
        const userId = req.session.user;
        const userData = await User.findOne({ _id: userId });
        const categories = await Category.find({ is_Listed: true });
        const orders = await Order.find({ UserId: userId }).populate({
            path: 'items.productId',
            model: 'Product'
        }).exec();

        res.render('orderHistory', { userData, categories, orders });
    } catch (error) {
        console.log(error);
    }
};

const loadOrderDetails = async (req, res) => {
    try {
        const userId = req.session.user;
        const orderId = req.query.orderId;
        const userData = await User.findOne({ _id: userId });
        const categories = await Category.find({ is_Listed: true });
        const orders = await Order.find({ UserId: userId, _id: orderId })
            .populate({
                path: 'items.productId',
                model: 'Product'
            })
            .exec();

        res.render('orderDetails', { userData, categories, orders });
    } catch (error) {
        console.log(error);
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ success: false});
        }
        
        const productUpdates = [];

        for (const item of deletedOrder.items) {
            const product = await Product.findById(item.productId);

            product.quantity += item.quantity;
            productUpdates.push(product.save());
        }


        return res.json({ success: true, message: 'Order canceled successfully' });
    } catch (error) {
        console.error(error);
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
    cancelOrder
}
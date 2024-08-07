const User = require('../models/user_model')
const bcrypt = require("bcrypt");
const Swal = require('sweetalert2')

const Product = require('../models/product_model')
const productOffer = require('../models/productOffer_model')
const Category = require('../models/category_model')
const categoryOffer = require('../models/categoryOffer_model')
const Coupon = require('../models/coupon_model')
const Order = require('../models/order_model');
const { find } = require('../models/wishlist_model');


const securePass = async (passoword) => {
    try {
        const secuerep = bcrypt.hash(passoword, 10);
        return secuerep;
    } catch (error) {
        console.log(error.message)
    }
}


const loadAdminLogin = async (req, res) => {
    try {
        const errormsg = req.flash('errormsg')
        res.render('adminlogin', { errormsg })
    } catch (error) {
        console.log(error);
    }
}



const loadUserlist = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; 
        const skip = (page - 1) * limit;

        const users = await User.find().skip(skip).limit(limit);
        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        res.render('userlist', { users, currentPage: page, totalPages });
    } catch (error) {
        console.log(error);
    }
}

const verifyadminLogin = async (req, res) => {
    try {
        const email = req.body.adminEmail;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    let errormsg = 'you have no access'
                    req.flash('errormsg', errormsg)
                    res.redirect('/admin/');
                } else {
                    req.session.admin = userData._id;
                    res.redirect("/admin/dashboard");
                }
            } else {
                req.flash('errormsg', 'Emial or password incorrect')
                res.redirect('/admin/');
            }

        } else {
            req.flash('errormsg', 'Emial or password incorrect')

            res.redirect('/admin/');
        }

    } catch (error) {
        console.log(error.message);
    }
}


const loadAdminDashboard = async (req, res) => {
    try {
        const orderData = await Order.find()
        const orderCount = await Order.countDocuments()

        const totalRevenue = orderData.reduce((acc, curr) => {
            return acc += curr.totalAmount
        }, 0)

        let productCount = 0;
        for (let i = 0; i < orderData.length; i++) {
            const product = orderData[i].items
            for (let i = 0; i < product.length; i++) {
                productCount += product[i].quantity
            }
        }

        const topSellingProducts = await Product.find({ soldProductCount: { $exists: true } }).sort({ soldProductCount: -1 });

        const topSellingCategory = await Category.find({ soldCount: { $exists: true } }).sort({ soldCount: -1 })


        res.render('dashboard', { totalRevenue, orderCount, productCount, topSellingProducts, topSellingCategory });
    } catch (error) {
        console.log(error.message);
    }
}

const loadblock = async (req, res) => {
    try {
        const userid = req.query.userid
        const userdata = await User.findOne({ _id: userid })
        const isblocked = userdata.is_verified
        if (isblocked == 1) {
            await User.findByIdAndUpdate(userid, { $set: { is_verified: 0 } })
            return res.json({ success: true })
        } else {
            await User.findByIdAndUpdate(userid, { $set: { is_verified: 1 } })
            return res.json({ success: true })
        }
    } catch (error) {
        console.log(error);
    }
}

const adminLogout = async (req, res) => {
    try {
        req.session.admin = null
        res.redirect('/admin/')
    } catch (error) {
        console.log(error);
    }
}


const productOfferLoad = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; 
        const skip = (page - 1) * limit;

        const products = await Product.find();
        const offer = await productOffer.find().skip(skip).limit(limit).populate('productId');
        const totalOffers = await productOffer.countDocuments();

        res.render('productOffer', {products,offer,currentPage: page,totalPages: Math.ceil(totalOffers / limit)});
    } catch (error) {
        console.log(error);
    }
};

const addProductOffer = async (req, res) => {
    try {
        const { productId, offerAmount, expDate } = req.body
        const addOffer = new productOffer({productId: productId,discount: offerAmount,expiryDate: expDate})
        await addOffer.save()
        await Product.findByIdAndUpdate(productId, { $push: { offers: addOffer._id } })
        res.json({ success: true })
    } catch (error) {
        console.log(error);
    }
}

const offerStatus = async (req, res) => {
    try {
        const { offerId } = req.body
        const offerData = await productOffer.findOne({ _id: offerId })
        const isActive = offerData.is_active
        if (isActive == 0) {
            await productOffer.findByIdAndUpdate(offerId, { $set: { is_active: 1 } })
            return res.json({ success: true })
        } else {
            await productOffer.findByIdAndUpdate(offerId, { $set: { is_active: 0 } })
            return res.json({ success: true })
        }
    } catch (error) {
        console.log(error);
    }
}

const loadCategoryOffer = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; 
        const skip = (page - 1) * limit;

        const category = await Category.find();
        const CatgOffer = await categoryOffer.find().skip(skip).limit(limit).populate('categoryId');
        const totalOffers = await categoryOffer.countDocuments();

        res.render('categoryOffer', {category,CatgOffer,currentPage: page,totalPages: Math.ceil(totalOffers / limit)});
    } catch (error) {
        console.log(error);
    }
};

const addCategOffer = async (req, res) => {
    try {
        const { categoryId, offerAmount, expDate } = req.body;
        const addCategoryOffer = new categoryOffer({
            categoryId: categoryId,
            discount: offerAmount,
            expiryDate: expDate
        });
        await addCategoryOffer.save();
        await Category.findByIdAndUpdate(
            categoryId,
            { $push: { offers: addCategoryOffer._id } },
            { new: true, useFindAndModify: false }
        );
        res.json({ success: true });
    } catch (error) {
        console.log(error);
    }
};

const catgOfferStatus = async (req, res) => {
    try {
        const { catgofferId } = req.body
        const offerData = await categoryOffer.findOne({ _id: catgofferId })
        const isActive = offerData.is_active
        if (isActive == 0) {
            await categoryOffer.findByIdAndUpdate(catgofferId, { $set: { is_active: 1 } })
            return res.json({ success: true })
        } else {
            await categoryOffer.findByIdAndUpdate(catgofferId, { $set: { is_active: 0 } })
            return res.json({ success: true })
        }
    } catch (error) {
        console.log(error);
    }
}


const loadCouponPage = async (req, res) => {
    try {
        const perPage = 6;
        const page = parseInt(req.query.page) || 1;

        const totalCoupons = await Coupon.countDocuments();
        const totalPages = Math.ceil(totalCoupons / perPage);

        const coupons = await Coupon.find().skip((perPage * page) - perPage).limit(perPage);

        res.render('couponPage', {coupons,currentPage: page,totalPages,perPage});
    } catch (error) {
        console.log(error);
    }
}

function couponIdGenerate() {
    const min = 100000
    const max = 999999
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const couponAdding = async (req, res) => {
    try {
        const { discount, minimumPrice, expiryDate } = req.body;
        const couponCode = couponIdGenerate()
        const addCoupon = new Coupon({
            couponCode: couponCode,
            discount: discount,
            minimumPrice: minimumPrice,
            expiryDate: expiryDate
        })
        await addCoupon.save()
        res.json({ success: true });
    } catch (error) {
        console.log(error);
    }
}

const statusChecked = async (req, res) => {
    try {
        const { isChecked, couponId } = req.body;
        if (isChecked === true) {
            await Coupon.findByIdAndUpdate(couponId, { $set: { is_active: 1 } });
            return res.json({ success: true });
        } else {
            await Coupon.findByIdAndUpdate(couponId, { $set: { is_active: 0 } });
            return res.json({ success: true });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false });
    }
};

const couponEdit=async(req,res)=>{
    try {
        const {couponId,minimumPrice,discount,expDate}=req.body
         const expiryDate = new Date(expDate);
        const couponData=await Coupon.findOneAndUpdate({_id:couponId},{$set:{minimumPrice:minimumPrice,discount:discount,expiryDate:expiryDate}})
        await couponData.save()
        res.json({success:true,coupon: couponData})
    } catch (error) {
        console.log(error);
    }
}

const loadSalesReport = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        let orderData;
        let subTotalInitial = 0; 
        let discountInitial = 0; 
        let subTotalFiltered = 0; 
        let discountFiltered = 0;
        let Details = null; 

        const allOrders = await Order.find().populate('items.productId');
        allOrders.forEach(order => {
            order.items.forEach(item => {
                subTotalInitial += item.price * item.quantity;
            });
            if (order.discount) {
                discountInitial += order.discount;
            }
        });

        if (req.query.type) {
            const today = new Date();
            let startDate, endDate;

            switch (req.query.type) {
                case 'today':
                    startDate = new Date(today.setHours(0, 0, 0, 0));
                    endDate = new Date(today.setHours(23, 59, 59, 999));
                    break;
                case 'last-week':
                    startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    endDate = new Date(today.setHours(23, 59, 59, 999));
                    break;
                case 'last-month':
                    startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    endDate = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
                    break;
                default:
                    break;
            }

            orderData = await Order.find({ currentDate: { $gte: startDate, $lt: endDate } }).populate('items.productId').skip(skip).limit(limit).sort({ currentDate: -1 });

            orderData.forEach(order => {
                order.items.forEach(item => {
                    subTotalFiltered += item.price * item.quantity;
                });
                if (order.discount) {
                    discountFiltered += order.discount;
                }
            });

            Details = orderData;

        } else if (req.query.startDate && req.query.endDate) {
            const start = new Date(req.query.startDate);
            const end = new Date(req.query.endDate);

            orderData = await Order.find({ currentDate: { $gte: start, $lt: end } }).populate('items.productId').skip(skip).limit(limit).sort({ currentDate: -1 });

            orderData.forEach(order => {
                order.items.forEach(item => {
                    subTotalFiltered += item.price * item.quantity;
                });
                if (order.discount) {
                    discountFiltered += order.discount;
                }
            });

            Details = orderData; 

        } else {
            orderData = await Order.find().populate('items.productId').skip(skip).limit(limit).sort({ currentDate: -1 });
        }

        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);
        const currentPage = page;
        const prevPage = currentPage > 1 ? currentPage - 1 : 1;
        const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

        res.render('salesReport', {orderData, subTotalInitial,discountInitial,subTotalFiltered,discountFiltered,Details,currentPage,totalPages,prevPage, nextPage,req,query: req.query});

    } catch (error) {
        console.log(error);
    }
};

const chartController = async (req, res) => {
    try {
        const { selectedItem } = req.body;
        let data = {};

        if (selectedItem === "daily") {
            const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const DailySales = await Order.aggregate([
                {
                    $group: {
                        _id: { $dayOfWeek: "$currentDate" },
                        totalSales: { $sum: "$totalAmount" }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            const dailyOrders = Array(7).fill(0);
            DailySales.forEach(sale => {
                dailyOrders[sale._id - 1] = sale.totalSales;
            });

            data = {
                labels: weekDays,
                datasets: [{
                    label: "Daily Sales",
                    backgroundColor: "rgba(0,0,255,0.6)",
                    data: dailyOrders
                }]
            };
        } else if (selectedItem === "monthly") {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthlySales = await Order.aggregate([
                {
                    $group: {
                        _id: { $month: "$currentDate" },
                        totalSales: { $sum: "$totalAmount" }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            const monthlyOrders = Array(12).fill(0);
            monthlySales.forEach(sale => {
                monthlyOrders[sale._id - 1] = sale.totalSales;
            });

            data = {
                labels: months,
                datasets: [{
                    label: "Monthly Sales",
                    backgroundColor: "rgba(0,0,255,0.6)",
                    data: monthlyOrders
                }]
            };
        } else if (selectedItem === "yearly") {
            const quarters = ["23-24", "24-25", "25-26", "27-28"];
            const quarterlySales = await Order.aggregate([
                {
                    $group: {
                        _id: { $ceil: { $divide: [{ $month: "$currentDate" }, 3] } },
                        totalSales: { $sum: "$totalAmount" }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            const quarterlyOrders = Array(4).fill(0);
            quarterlySales.forEach(sale => {
                quarterlyOrders[sale._id - 1] = sale.totalSales;
            });

            data = {
                labels: quarters,
                datasets: [{
                    label: "Yearly Sales",
                    backgroundColor: "rgba(0,0,255,0.6)",
                    data: quarterlyOrders
                }]
            };
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    loadAdminDashboard,
    loadAdminLogin,
    verifyadminLogin,
    securePass,
    loadUserlist,
    loadblock,
    adminLogout,
    productOfferLoad,
    addProductOffer,
    offerStatus,
    loadCategoryOffer,
    addCategOffer,
    catgOfferStatus,
    loadCouponPage,
    couponAdding,
    couponEdit,
    statusChecked,
    loadSalesReport,
    chartController,

}
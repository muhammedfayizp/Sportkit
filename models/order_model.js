    const mongoose = require('mongoose')
    const orderSchema = new mongoose.Schema({
        UserId: {
            type: mongoose.Schema.Types.ObjectId,
            res: 'userData',
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                status: {
                    type: String,
                    enum: ['Confirmed', 'Shipped', 'Cancelled', 'Return', 'Delivered'],
                    default: 'Confirmed'
                },
                reason: {
                    type: String,
                },
                price: {
                    type: Number,
                },
               
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        addressDetails: {
            name: {
                type: String,
                required: true
            },
            mobile: {
                type: Number,
                required: true
            },
            pincode: {
                type: Number,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            dist: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            houseName: {
                type: String
            },
            houseNo: {
                type: String,
                required: true
            }
        },
        PaymentMethod: {
            type: String,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'Success', 'Failed'],
            default: 'pending'
        },
        orderId: {
            type: String,
            required: true
        },
        currentDate: {
            type: Date,
            default: () => Date.now()
        },
        approvel:{
            type:Number,
            default:0
        },
        couponCode:{
            type:Number
        },
        discount:{
            type:Number
        },

    })

    module.exports = mongoose.model('Order', orderSchema)
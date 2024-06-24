const mongoose=require('mongoose')
const cartSchema = new mongoose.Schema ({
    UserId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required:true
    },
    products : [{
        price : {
            type : Number,
            required : true
        },
        quantity : {
            type : Number,
            default :1
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        
        totalAmount : {
            type : Number,
            required : true
        }
    }],
    cartTotal : {
        type : Number,
        required : true
    },
    deliveryCharge:{
        type:Number,
        required:false,
        default:0
    }
   
})

module.exports = mongoose.model('Cart',cartSchema)
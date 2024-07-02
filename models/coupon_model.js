const mongoose=require('mongoose')
const couponSchema=mongoose.Schema({
    couponCode:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        require:true
    },
    minimumPrice:{
        type:Number,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    },
    is_active:{
        type:Boolean,
        default:0
    },
    eligible:{
        type:String
    }
})
couponSchema.index({expiryDate:1},{expireAfterSeconds:0})
module.exports=mongoose.model('Coupon',couponSchema)
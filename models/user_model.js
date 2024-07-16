const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
   
    name:{
        type: String,
        required: true
    },
    
    mobile:{
        type:Number,
       
    },

    email:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },

    is_admin:{
        type: Number,
        required: true
    },

    is_verified:{
        type: Number,
        default: 0
    },
    coupon:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Coupon',
    }],
    referral:{
        type:String,
    },
    referred:{
        type:String
    }


})


module.exports=mongoose.model('User',userSchema)
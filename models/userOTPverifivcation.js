const mongoose=require('mongoose') 
const userOTPschema=mongoose.Schema({
    
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})

userOTPschema.index({createAt:1},{expireAfterSeconds:60});
const UserOTPverification=mongoose.model('UserOTPverification',userOTPschema);
module.exports=UserOTPverification
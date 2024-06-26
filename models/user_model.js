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
    }

},{versionKey:false})


module.exports=mongoose.model('User',userSchema)
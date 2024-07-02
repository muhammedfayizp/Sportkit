const mongoose=require('mongoose');
const addressSchema=new mongoose.Schema({

    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    address:[{
        name:{
            type:String
        },
        mobile:{
            type:Number
        },
        pincode:{
            type:Number
        },
        dist:{
            type:String
        },
        state:{
            type:String
        },
        
        city:{
            type:String,
            required:true
        },
        houseName:{
            type:String
        },
        houseNo:{
            type:Number
        }
    }]
})

module.exports=mongoose.model('Address',addressSchema)
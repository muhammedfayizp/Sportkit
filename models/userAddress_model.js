const mongoose=require('mongoose');
const addressSchema=mongoose.Schema({

    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    address:[{
        name:{
            type:String
        },
        email:{
            type:String
        },
        mobile:{
            type:Number
        },
        pincode:{
            type:Number
        },
        state:{
            type:String
        },
        dist:{
            type:String
        },
        city:{
            type:String
        },
        area:{
            type:String
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
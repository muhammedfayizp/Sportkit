const mongoose=require('mongoose');
const walletSchema=new mongoose.Schema({

    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    history:[{
        amount:{
            type:Number,
        },
        date:{
            type:Date,
            default:Date.now
        },
        transactionType:{
            type:String,
        },
        method:{
            type:String
        },
        previousAmount:{
            type:Number
        },
        currentAmount:{
            type:Number
        }
    }],
    balance:{
        type:Number
    }

})

module.exports=mongoose.model('Wallet',walletSchema)
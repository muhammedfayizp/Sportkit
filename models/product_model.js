    const mongoose=require('mongoose');
    const Category=require('./category_model');
    const { path } = require('../Routes/userRoute');
    const productSchema=mongoose.Schema({
        name:{
            type:String,
            required:true  
        },
        price:{
            type:Number,
            required:true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        quantity:{
            type:Number,
            required:true
        },
        Inputimage:{
            type:[{
                filename:String,
                path:String
            }],
            validate:[arraylimit,'{PATH} exceedes the limit of 4'],
            required:true
        },
        description:{
            type:String,
            required:true
        },
        is_delete:{
            type:Boolean,
            default:true
        },
        offerPrice:{
            type:Number,
        },
        productDiscount:{
            type:Number
        }
    })

    function arraylimit(val){
        return val.length <= 4;
    }

    module.exports=mongoose.model('Product',productSchema)
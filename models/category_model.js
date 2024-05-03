const mongoose=require('mongoose');
const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    is_Listed:{
        type:Boolean,
        default:true
    }
})
module.exports=mongoose.model('Category',categorySchema)
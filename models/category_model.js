const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    is_Listed: {
        type: Boolean,
        default: true
    },
    offers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryOffer'
    }],
    soldCount:{
        type:Number
    }
});

module.exports = mongoose.model('Category', categorySchema);

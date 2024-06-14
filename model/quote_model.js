const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, { timestamps: true }); 
module.exports = mongoose.model("quotes", quoteSchema);

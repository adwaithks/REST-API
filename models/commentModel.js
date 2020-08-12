const mongoose = require('mongoose');

module.exports = mongoose.Schema({
    comment:{
        type: String
    },
    commenter: {
        type: String
    },
    commentedOn: {
        type: Date,
        default: Date.now()
    }
})
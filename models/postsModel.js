const mongoose = require('mongoose');
const commentSchema = require('./commentModel');

module.exports = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 4
    },
    author: {
        type: String
    },
    content: {
        type: String,
        required: true,
        min: 100
    },
    dateOfCreation:{
        type: Date,
        default: Date.now()
    },
    comments: [commentSchema],
    likes: {
        type: Number,
        default: 0
    }
})

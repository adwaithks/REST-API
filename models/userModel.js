const mongoose = require('mongoose');
const postsSchema = require('./postsModel');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    likedPeoples: [{
        type: String,
        default: null
    }],
    username: {
        type: String,
        required:true,
        min: 4
    },
    pwdResetToken: {
        type: String,
        default: null
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    posts: [postsSchema]
});

module.exports = mongoose.model('User', userSchema);

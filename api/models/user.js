const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, // this is THE regex(regular expression)
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: {
        type: mongoose.Types.ObjectId,
        ref: 'Cart'
    },
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Order",
            required: true,
        }
    ]
})

module.exports = mongoose.model('User', userSchema);
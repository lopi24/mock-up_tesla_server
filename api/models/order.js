const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderFrom: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cart: {
        type: mongoose.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    orderedOn: {
        type: Date,
        default: new Date()
    },
});

module.exports = mongoose.model('Order', orderSchema);
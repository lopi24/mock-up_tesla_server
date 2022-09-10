const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    cartFrom: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                required: true
            }
            // _id: false // => This should be true because when inside the cart page, when you press remove(a specific order), we just need to target the _id to remove the productId and quantity at the same time. WIth that no need for complex code.
        }
    ],
    checkout: {
        type: Boolean,
        default: false
    }
});

// LOGIC: whenever you press add to cart it ask for userId which will register the cart to the user(it will update the user's cart object using .push method) and it will also ask for productId and quantity. And when adding cart with the same productId the quantity wil only update. And when adding more product it will just .push to the products object

module.exports = mongoose.model('Cart', cartSchema);
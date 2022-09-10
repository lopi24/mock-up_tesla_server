const express = require('express');
const router = express.Router();
const auth = require('../middleware/check-auth');

const ControllerCart = require('../controllers/cart');

// client - add-to-cart
router.post('/add-to-cart', auth.verify, ControllerCart.cart_addToCart);

// client - get-cart-details(go to cart)
router.get('/cart-details', auth.verify, ControllerCart.cart_cartDetails);

// client - remove-product-from-cart
// Moreover in Frontend. Try to put logic when quantity is <1 it will remove automatically.
router.patch('/remove-product', auth.verify, ControllerCart.cart_removeProduct);

// admin - get-all-carts
router.get('/', auth.verify, ControllerCart.cart_getAllCarts);

// admin - get-all-checkout-carts
router.get('/checkout-carts', auth.verify, ControllerCart.cart_getAllCheckoutCarts);

// client - add/reduce quantity
router.patch('/update-quantity', auth.verify, ControllerCart.cart_updateQuantity);

// client - check if cartProduct is existing in cart
router.post('/cart-product-exists', auth.verify, ControllerCart.cart_checkCartProduct)

module.exports = router;
const express = require('express');
const router = express.Router(); //subpackage of express framework that gives is capabilities to handle different routes and reaching different
const auth = require('../middleware/check-auth');

// * ALL MIDDLEWARES SHOULD PUT IN THE ROUTES FOLDER *

//import here the controllers
const ControllerOrder = require('../controllers/orders');

// // NEW
// client - checkout
router.post('/checkout', auth.verify, ControllerOrder.order_createOrder);

// admin - get all orders
router.get('/', auth.verify, ControllerOrder.order_getAll);

// client - cancel order
// router.delete('/:orderId', auth.verify, ControllerOrder.order_cancelOrder);

// client - view order details
router.get('/:orderId', auth.verify,  ControllerOrder.order_getOrderDetails);

module.exports = router; 
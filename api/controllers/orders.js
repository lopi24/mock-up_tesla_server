const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');

// Change all of this due to new order model.


// FINISHED add to cart route
// NEXT => checking-out
// LOGIC => when you click checkout the userId that was save in localStorage and the cartId that you're in will pass to the req.body to make a new order. After you checkout the cartId that you recently checked-out will update the checkout object to true;


// client - checkout
module.exports.order_createOrder = async (req, res) => {
    const verifiedUserId = req.user.id
    try {
        const findUser = await User.findById(req.body.userId)
        // console.log(findUser)
        const findUserId = await findUser.id;

        if(verifiedUserId === findUserId){
            const order = new Order({
                orderFrom: req.body.userId,
                cart: req.body.cartId
            })
            const newOrder = await order.save();
            const newOrderId = await newOrder.id;
            if(newOrder) {
                findUser.orders.push(newOrderId)
                findUser.save();
                const findCart = await Cart.findById(req.body.cartId);

                const findCartId = await findCart.id;
                const updateCheckout = await Cart.findOneAndUpdate(
                    {
                        _id: findCartId
                    },
                    {
                        checkout: true
                    },
                    {
                        new: true
                    }
                )
                // const deleteCart = await findCart.remove();

                res.status(200).json({
                    message: 'Order Successfully Checkout.',
                    newOrder,
                    findUser,
                    updateCheckout
                })
            }
        }
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

// admin - get all orders
module.exports.order_getAll = async (req, res) => {
    const tokenIsAdmin = req.user.isAdmin
    try {
        if(tokenIsAdmin) {
            const orders = await Order.find().populate('cart orderFrom')

            if(orders.length < 1) {
                res.json({
                    message: 'There are no orders'
                })
            } else {
                res.status(200).json({
                    message: "Successfully retrieved all orders",
                    orders
                })
            }
        } else {
            res.status(403).json({
                message: 'Unauthorized!'
            })
        }
        
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

// module.exports.order_cancelOrder = async (req, res) => {
//     const orderId = req.params.orderId
//     const tokenId = req.user.id
//     console.log(tokenId)
//     try {
//         const findOrder = await Order.findById(orderId)
//         console.log(findOrder)
//         const cartId = await findOrder.cart._id
//         console.log(cartId)

//         const findUser = await User.findById(findOrder.orderFrom)

//         const userId = await findUser.id
//         console.log(userId)

//         if(tokenId === userId) {
//             const removeOrder = await Order.remove({ _id: orderId })

//             if(removeOrder) {
//                 deleteOrderInUser = await User.findOneAndUpdate(
//                     {
//                         _id: userId
//                     },
//                     {
//                         $pull: {
//                             orders: orderId
//                         }
//                     }
//                 )
//                 const removeCart = await Cart.remove({ _id: cartId })
//                 res.status(200).json({
//                     message: 'Order Cancelled Successfully.'
//                 })
//             }
//         }
        
//     } catch (err) {
//         res.status(500).json({
//             error: err
//         })
//     }
// }


module.exports.order_getOrderDetails = async (req, res) => {
    const tokenId = req.user.id;
    // const isAdmin = req.user.isAdmin;
    console.log(tokenId)
    try {
        const findOrder = await Order.findById(req.params.orderId)
        .populate({
            path: 'cart',
            populate: ({
                path: 'products',
                populate: ({
                    path: 'productId'
                })
            })
        })
        const findOrderFrom = await findOrder.orderFrom
        const findUser = await User.findById(findOrderFrom);
        const findUserId = findUser.id
        if((tokenId === findUserId) || (req.user.isAdmin === true)) {
            res.status(200).json({
                message: 'Order retrieved successfully.',
                findOrder
            })
        } else if(tokenId !== findUserId) {
            res.status(403).json({
                message: 'Unauthorized'
            })
        }

    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}
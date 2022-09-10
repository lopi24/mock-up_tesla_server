const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');
const router = require('../routes/cart');

// change the cart model => add checkout object with the value of boolean: true or false. In add to cart route, when adding product, it will get all carts that belong to the same cartFrom id. And it will filter if it is checkout or not, if already checkout it means it is already in the order, and if there is cart which has false checkout then it will be use to put all products (add to cart) and if 

module.exports.cart_addToCart = async (req, res) => {
    const verifiedUserId = req.user.id
    // console.log(verifiedUserId)
    try {
        // const findProduct = await Product.findById(req.body.productId)

    //
        // FIRST: check if cart with checkout: false is existing
        const findCart = await Cart.find({cartFrom: verifiedUserId, checkout: false})
        console.log(findCart.length)
        // console.log(findCart[0].id)
        if(findCart.length === 0) {
            // SECOND: when you click add to cart, you must also create your own cart
            const cart = new Cart({
                cartFrom: verifiedUserId
            })
            const newCart = await cart.save();
            console.log(newCart.id)
            // THIRD: insert the productId and the quantity to the cart.
            const addToCart = await Cart.findOneAndUpdate(
                {
                    _id: newCart
                },
                {
                    $push: {
                        products: [
                            {
                                productId: req.body.productId,
                                quantity: req.body.quantity
                            }
                        ]
                    }
                }
            )
            res.status(200).json({
                message: 'Successfully added to cart',
                addToCart
            })
            
        // FOURTH: if cart is existing then check if only 1 cart, if more than something is wrong. If only 1 then get the cartId
        } else if(findCart.length === 1) {
            const findCartId = await findCart[0].id;
        // FIFTH: insert the productId and the quantity to the cart.
            const addToCart = await Cart.findOneAndUpdate(
                {
                    _id: findCartId
                },
                {
                    $push: {
                        products: [
                            {
                                productId: req.body.productId,
                                quantity: req.body.quantity
                            }
                        ]
                    }
                }
            )
            res.status(200).json({
                message: 'Successfully added to cart',
                addToCart
            })

        } else if(findCart.length > 1) {
            res.status(500).json({
                message: 'The cart is more than 1, something is wrong with the code.'
            })
        }
        
    //
        
        // const findCartAndAddProductToCart = await Cart.findOneAndUpdate(
        //     {
        //         _id: req.body.cartId
        //     },
        //     {
        //         $push: {
        //             products: [
        //                 {
        //                     productId: req.body.productId,
        //                     quantity: req.body.quantity
        //                 }
        //             ]
        //         }
        //     }
        // )
        // console.log(findCartAndAddProductToCart)
        // res.status(200).json({
        //     findCartAndAddProductToCart
        // })
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.cart_getAllCarts = async (req, res) => {
    const tokenIsAdmin = req.user.isAdmin
    try {
        if(tokenIsAdmin) {
            const carts = await Cart.find().populate({
                    path: 'cartFrom',
                    select: '_id email'
            })
            res.status(200).json({ carts })
        }
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

// get-all-checkout-carts
module.exports.cart_getAllCheckoutCarts = async (req, res) => {
    const tokenIsAdmin = req.user.isAdmin
    try {
        if(tokenIsAdmin) {
            const checkedOutCarts = await Cart.find({ checkout: true }).populate({
                path: 'cartFrom',
                select: '_id email'
            })
            res.status(200).json({ checkedOutCarts })
        }
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.cart_cartDetails = async (req, res) => {
    const verifiedUserId = req.user.id;
    try {
        let findCartFromVerifiedUserId;
        findCartFromVerifiedUserId = await Cart.find({ cartFrom: verifiedUserId, checkout: false }).populate({
            path: 'products.productId',
            model: 'Product'
        });
        if(findCartFromVerifiedUserId.length < 1) {
            // test
            const anotherNewCart = new Cart({
                cartFrom: verifiedUserId
            })
            findCartFromVerifiedUserId = await anotherNewCart.save();
            //
        }

        // after loggin in we will send the cart details to the frontend and save the cartId to the localStorage.

        if(findCartFromVerifiedUserId) {
            res.status(200).json({ findCartFromVerifiedUserId })
        }
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.cart_removeProduct = async (req, res) => {
    const verifiedUserId = req.user.id
    console.log(verifiedUserId)
    try {
        const findCart = await Cart.find({cartFrom: verifiedUserId, checkout: false})
        console.log(findCart)
        const findCartId = await findCart[0].id
        console.log(findCartId)
        const findCartAndRemoveProduct = await Cart.findOneAndUpdate(
            {
                _id: findCartId
            },
            {
                $pull: {
                    products: {
                        _id: req.body.addedProductId
                    }
                }
            }, { new: true }
        )
        if(findCartAndRemoveProduct) {
            // console.log(findCartAndRemoveProduct)
            res.status(200).json({
                findCartAndRemoveProduct
            })
        }
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

// update quantity
module.exports.cart_updateQuantity = async (req, res) => {
    const verifiedUserId = req.user.id
    try {
        // To update ang object value inside an array of object, you need to use updateOne and $set
        const updateQuantity = await Cart.updateOne(
            {
                'products._id': req.body.cartProductId
            },
            { 
                $set: {
                    'products.$.quantity': req.body.quantity
                }
            },
            {
                new: true
            }
        )
        console.log(updateQuantity)
        res.status(200).json({
            message: 'Successfully updated the quantity',
            updateQuantity
        })
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.cart_checkCartProduct = async (req, res) => {
    const verifiedUserId = req.user.id;
    // console.log(verifiedUserId)
    try {
        const product = await Cart.find({
            cartFrom: verifiedUserId,
            checkout: false,
            'products.productId': req.body.productId
        })
        if(product.length > 0) {
            res.json({
                message: "Product already exists",
                product
            })
        } else {
            res.status(200).json({
                message: "There are no Product with that Id inside the cart.",
                product
            })
        }
        console.log(product)
        
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}
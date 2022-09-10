// const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order')
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const auth = require('../middleware/check-auth');
const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports.user_getAll = async (req, res) => {
    const tokenIsAdmin = req.user.isAdmin
    try {
        if(tokenIsAdmin) {
            const users = await User.find()
            if(users.length < 1) {
                res.json({
                    message: 'There are no registered users.'
                })
            } else {
                res.status(200).json({
                    message: 'Successfully retrieved all users',
                    users
                })
            }
        } else {
            res.status(403).json({
                message: 'Unauthorized'
            })
        }
        
    } catch (err) {
        return console.log(err);
    }
}

module.exports.user_emailExists = async (req, res) => {
    try {
        let user = await User.find({ email: req.body.email })
        if(user.length > 0) {
            res.status(409).json({
                message: 'Conflict, Email already Exist!'
            })
        } else {
            res.status(201).json({
                message: 'Email is available.'
            })
        }
    } catch(err) {
        res.status(500).json({ error: err })
    }
    
}

module.exports.user_signup = async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            isAdmin: req.body.isAdmin //remove this later
        })
        const newUser = await user.save();
        // console.log(newUser.id)

        // const newUserId = await newUser.id
        // const cart = new Cart({
        //     cartFrom: newUserId
        // })
        // const newCart = await cart.save();

        res.status(200).json({
            message: 'User Successfully Registered.',
            newUser,

            // newCart

        })
    } catch(err) {
        res.status(500).json({ error: err })
    }
}

module.exports.user_login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if(user === null) {
            return res.status(404).json({
                message: "User not Found, proceed to signup instead." 
            })
        } 
    
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            } if(result) {
                const token = auth.createAccessToken(user.toObject())

                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                })
            }
            return res.status(401).json({
                message: 'Auth failed'
            })
        })
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

// PLEASE FIX THE FETCHING OF DATA/DETAILS AFTER LOGGING IN
// The problem here is that you just need to send the verified user details to the frontend and not by finding id with it and with token id through body in backend.
// PROBLEM FIXED!

module.exports.user_get = async (req, res) => {
    const verifiedUser = req.user.id
    try {
        const user = await User.findById(verifiedUser)
        .populate({
            path: 'orders',
            populate: {
               path: 'cart',
               populate: {
                path: 'products',
                populate: ({
                    path: 'productId'
                })
               }
            }
        })
        if(user) {
            res.status(200).json({
                user
            })
        }
    } catch(err) {
        error: err
    }
    
}


// this is for admin authenticated if it is really you and if you're an admin.
module.exports.user_delete = async (req, res) => {
    tokenIsAdmin = req.user.isAdmin
    try {
        if(tokenIsAdmin) {
            const removeUser = await User.deleteOne({ _id: req.params.userId })
            res.status(200).json({
                message: 'User Deleted Successfully!'
            })
        } else {
            res.status(403).json({
                message: 'Unauthorized'
            })
        }
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

//delete all users
module.exports.user_deleteAll = async (req, res) => {
    const tokenIsAdmin = req.user.isAdmin
    try {
        if(tokenIsAdmin) {
            const orders = await Order.remove(); // first, delete all orders
            const carts = await Cart.remove();
            const users = await User.remove({ isAdmin: false }); // second, delete all users
            res.status(200).json({
                message: 'All users was successfully deleted.'
            })
        } else {
            res.status(403).json({
                message: 'Unauthorized'
            })
        }
    } catch(err) {
        res.status(500).json({ error: err })
    }
}
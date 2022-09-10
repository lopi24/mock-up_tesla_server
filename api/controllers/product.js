const mongoose = require('mongoose');

const Product = require('../models/product');

// //import multer 
const multer = require('multer');
const path = require('path');


module.exports.products_productNameExist = async (req, res) => {
    // return Product.find({ name: params.name })
    // .then(result => {
    //     return result.length > 0 ? true: false
    // })
    const isAdmin = req.user.isAdmin
    // console.log(isAdmin)
    try {
        if(isAdmin) {
            const findProductName = await Product.find({ name: req.body.name, category: req.body.category })
            if(findProductName.length > 0) {
                res.status(201).json({
                    message: true
                })
            } else {
                res.json({
                    message: false
                })
            }
        } else {
            res.status(401).json({message: 'Unauthorized'})
        }
        
    } catch(err) {
        res.status(500).json({ error: err })
    }
}

//new get all products/ doesnt need to be admin to get products
module.exports.products_get_all = async (req, res) => {
    try {
        const products = await Product.find();
        if(products.length < 1) {
            res.json({
                message: 'There are no products.'
            })
        } else {
            res.status(200).json({products})
        }
    } catch(err) {
        res.status(500).json({error: err})
    }
}

// new create product/ needs to be admin to create a product
module.exports.products_createNewProducts = async (req, res) => {
    const tokenIsAdmin = req.user.isAdmin;
    const {name, description, category, isAvailable, price} = req.body;
    try {
        if(tokenIsAdmin) {
            let product = new Product({
                name,
                description,
                category,
                isAvailable,
                price,
                productImage: req.file.path
            })
            const newProduct = await product.save();
            res.status(201).json({
                message: "Product Successfully Created",
                newProduct
            })
        }
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
    
}

// new get single product
module.exports.products_getSingleProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.productId);
        if(product.length < 1) {
            res.json({
                message: "There are no product with that id"
            })
        } else {
            res.json({product})
        }
    } catch(err) {
        res.status(500).json({error: err})
    }
}

module.exports.products_delete_product = (req, res) => {
    const id = req.params.productId;
    const tokenIsAdmin = req.user.isAdmin;
    try {
        if(tokenIsAdmin) {
            Product.deleteOne({ _id: id })
            .then(result => {
                res.status(200).json({
                    message: "Deleted Successfully"
                })
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.products_deleteAll = async (req, res) => {
    const tokenIsAdmin = req.user.isAdmin
    try {
        if(tokenIsAdmin) {
            const products = await Product.remove();
            res.status(200).json({
                message: 'Successfully deleted all products.'
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

// add controllers for change isAvailable to false using .archive
module.exports.product_isAvailable = async (req, res) => {
    const tokenIsAdmin = req.user.isAdmin;
    const { isAvailable } = req.body;
    const productId = req.params.productId;
    const options = { new: true };
    try {
        if(tokenIsAdmin) {
                const prodAvailable = await Product.findByIdAndUpdate
                (
                    productId,
                    {isAvailable},
                    options
                )
            res.status(200).json({
                message: `Product isAvailable is updated to ${isAvailable}.`
            })
        } else {
            res.status(401).json({
                message: 'Unauthorized'
            })
        }
        
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

// add controllers for update product
module.exports.product_update = async (req, res) => {
    const tokenIsAdmin = req.user.isAdmin;
    const { name, description, category, price, isAvailable } = req.body;
    // const { productImage } = req.file.path;
    const productId = req.params.productId;
    const options = { new: true };
    try {
        if(tokenIsAdmin) {
                const prodUpdate = await Product.findByIdAndUpdate
                (
                    productId,
                    {
                        name,
                        description,
                        category,
                        price,
                        isAvailable
                    },
                    options
                )
            res.status(200).json({
                message: `Product successfully updated.`,
                prodUpdate
            })
        } else {
            res.status(401).json({
                message: 'Unauthorized'
            })
        }
        
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}
const express = require('express');
const router = express.Router(); //subpackage of express framework that gives is capabilities to handle different routes and reaching different
// controllers
const ProductsController = require('../controllers/product')
// middlewares
const auth = require('../middleware/check-auth')
const mult = require('../middleware/multer')

// new get all products
router.get('/', ProductsController.products_get_all);

//new get single product
router.get('/:productId', ProductsController.products_getSingleProduct);

// router.post('/productName-exist', (req, res) => {
//     ProductsController.products_productNameExist(req.body).then(result => res.send(result));
// })

router.post('/productName-exist', auth.verify, ProductsController.products_productNameExist)

// admin - new add product route
router.post('/add-product', auth.verify, mult.upload.single('productImage'), ProductsController.products_createNewProducts)

// admin - delete single product
router.delete('/:productId', auth.verify, ProductsController.products_delete_product);

// admin - delete all products
router.delete('/', auth.verify, ProductsController.products_deleteAll);

// admin - update product availability
router.patch('/:productId', auth.verify, ProductsController.product_isAvailable);

// admin - update all information of single product
router.put('/:productId', auth.verify, ProductsController.product_update);


module.exports = router; 
// test
const express = require('express');
const app = express();
const morgan = require('morgan'); //logging package for node.js
const bodyParser = require('body-parser'); //we can use this to parse the body of incoming request it is not readable by default in node.js
// body-parser does not support files but does support urlencoded, bodies and json data.
//To use body-parser 1st import it. Line 4
const mongoose = require('mongoose');
require('dotenv').config() //import dotenv(forSecurity)

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const userRoutes = require('./api/routes/user');

const cartRoutes = require('./api/routes/cart');

const connectionString = process.env.DB_CONNECTION_STRING;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise; // for depracation warning.

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Successfully Connected to DATABASE: MongoDB Atlas'));

app.use(morgan('dev')); // to make use of morgan

app.use('/uploads', express.static('./uploads'));

app.use(bodyParser.urlencoded({ extended: false })); //import body-parser middleware to what kind of body you want to parse. In this case we put the urlencoded bodies and extended: true - means allows us to parse extended bodies with rich data in it. AND false - for simple bodies for URL encoded data.
app.use(bodyParser.json()); //importing body-parser middleware which will apply also to json(). Declared as a method without argument.
//these will now extract JSON data and make it easily readable to us.

//here's CORS(Cross-Origin-Resource-Sharing)
//if both are coming from the same server like localhost:3000 - you dont need cors
//that is a traditional web app where you get back traditional web pages and on one page you use JQuery or AJAX
//BUT in rest api, typically have different urls/origin/port if not the same
//trying to make a request to a resource on the server will fail because as a default they have different origin.
//luckily we CAN disable this mechanism by sending some "headers" FROM the server TO the client essentially tell the browser which is running our client application, which tells the client that it's okay, you can have access and then the browser says, OK!
//at the bottom we will ensure that we send the right headers back.
//we made it this way to append the headers to any respond we sent back.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //in error it appears that "There are no Access-Control-Allow-Origin". Now we set it, it will be present. which headers we want to go along with = "*" means we give access to everything
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //which kind of headers we want to accept? = the second params
    //below is for check if the incoming req method(method = is a property which gives us access to the http method used on the request) is equal to 'OPTIONS'.
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({}); // we add an additional header where i tell the browser what he may send.(the second params)
    }
    next(); // if we received nothing about the above then go to the next() so the other routes can take over.
});

app.use('/products', productRoutes);
app.use('/order', orderRoutes);

app.use('/user', userRoutes);
app.use('/cart', cartRoutes);

//Error handling for all - made it easy
//*Always use this now
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;
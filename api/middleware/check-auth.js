const jwt = require('jsonwebtoken');

//this is jwt concept for authenticating a user.

// module.exports = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1];
//         // console.log(token)
//         const decoded = jwt.verify(token, process.env.JWT_KEY);
//         req.userData = decoded;
//         // the idea is why we create this is because, when you're a client, you shouldn't be able to delete, see orders, etc that an admin can only see/do. Only the neccessary things like getting all products is the only thing you are allowed to do.
//         //OR when you visit websites you shouldn't able to do what registered members do. SO we need this token specially this middleware to authenticate that if the user is registered and currently logged in, he/she can visit routes that are authenticated.
//         // we put this middleware to those routes that have token that needs verification.
//         // token is not encrypted. SO
//         // we need to verify first to return something.
//         // .verify() - is for verification of the token. Verifying if the token is valid or not/if the token is really from the server or just being created/trying to duplicate.
//         // we put token to routes because we want to protect sensitive information like password. AND
//         // There are some routes that we dont want to protect.
//         // so we created this middleware to verify to check whether the user is authenticated or not
//     } catch (error){
//         return res.status(401).json({
//             message: "Auth Failed!"
//         })
//     }
//     next();
// };





// module.exports.createAccessToken = (user) => {
//     const data = {
//         id: user._id,
//         email: user.email,
//         isAdmin: user.isAdmin
//     }
//     return jwt.sign(data, process.env.JWT_KEY, {
//         expiresIn: '1hr'
//     });
// }


// Test

module.exports.createAccessToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }

    const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: '1hr'
    });

    return token
}






// this verify token is for verifying if the user is authenticted.
// this is usually used when getting a data, we will verify it if it is authenticated to determine the proper authorization rights for the user.
// we slice 7 characters here
// here in this project we will not going to use it for now.
// module.exports.verify = (req, res, next) => {
//     let token = req.headers.authorization

//     if (typeof token !== "undefined") {
//         token = token.slice(7, token.length)

//         return jwt.verify(token, process.env.JWT_KEY, (err, data) => {
//             return (err) ? res.status(403).json({ message: "token no longer valid" }) : next()
//         })
//     } else {
//         return res.status(401).json({ auth: "Authorization failed"})
//     }
// }



//test - authenticate user
module.exports.verify = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // console.log("authHeader: " + authHeader); => this is the "Bearer Token"
    // const token = authHeader && authHeader.split(' ')[1] => THE SAME AS LINE 88
    const token = authHeader && authHeader.slice(7, authHeader.length)
    // console.log("TOKEN: " + token) => this is the "Token" only
    if(token == null) return res.sendStatus(401)
    // console.log(token)

    return jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}




//new test
// module.exports.verify = (req, res, next) => {
//     // get auth header value 
//     const bearerHeader = req.headers['authorization'];
//     // check if bearer is undefined
//     if(typeof bearerHeader !== 'undefined') {
//         // Split at the space 
//         const bearer = bearerHeader.split(' ');
//         // get token from array
//         const bearerToken = bearer[1];
//         // set the token
//         req.token = bearerToken;
//         // nexxt middleware
//         next();
//     } else {
//         // Forbidden
//         res.sendStatus(403);
//     }
// }




// if you want to display the neccessary information in a page when logged in. Add a decode token to decode or decrypt the access token since it is hashed
// and decoding is to strip away the headers section or bring back the sliced 7 characters in token to see if it is really you.

// module.exports.decode = (token) => {
//     // control structure to determine the response if an access token is captured.
//     if(typeof token !== 'undefined') {
//         token = token.slice(7, token.length);
//         return jwt.verify(token, process.env.JWT_KEY, (err, data) => {
//             return (err) ? null : jwt.decode(token, {
//                 complete: true
//             }).payload
//         })
//     } else {
//         return null
//     }
// }
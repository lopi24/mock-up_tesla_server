const multer = require('multer'); //multer is like a body-parser but, multer parses foreign data.


//storage strategy
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); //1st params is potential error. And 2nd params is path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname); //1st params is error. And 2nd is the filename
    }
}); // this will make how files will be stored.

const fileFilter = (req, file, cb) => {
    // this means accepting only the jpeg and png type of file
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        //accept a file
    cb(null, true);
    } else {
        //reject a file
        cb(new Error('jpg, jpeg or png type only'), false);
    }
}

module.exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // this means 1024 byts * 1024 byts * 5 byts.
    // in here means we can also set limit of the fileSize for filtering size of file
    },
    fileFilter: fileFilter
}); // install multer for uploading images

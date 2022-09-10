const express = require('express');
const router = express.Router();
const ControllerUser = require('../controllers/user');
const auth = require('../middleware/check-auth');

// admin - getting all users
// put auth.verify here as middleware and put in controllers the logic if admin and should be verified to access.
router.get('/', auth.verify, ControllerUser.user_getAll);

// client - check if email exist
router.post('/email-exists', ControllerUser.user_emailExists);

// client - signup
router.post('/signup', ControllerUser.user_signup);

// client - logging-in
router.post('/login', ControllerUser.user_login);
 
// client - go to your own details
router.get('/details', auth.verify, ControllerUser.user_get);

// admin - delete user
router.delete('/:userId', auth.verify, ControllerUser.user_delete);

// admin - delete all users
router.delete('/', auth.verify, ControllerUser.user_deleteAll);

module.exports = router;
const router = require('express').Router();
const loginController = require ('../controllers/loginController');

router.get('/', loginController.isLoggedIn, loginController.login);

router.get('/logout', loginController.logout);

router.post('/validate', loginController.isLoggedIn, loginController.validate);

router.post('/register', loginController.isLoggedIn, loginController.register);

module.exports = router;
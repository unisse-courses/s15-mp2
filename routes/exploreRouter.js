const router = require('express').Router();
const exploreController = require ('../controllers/exploreController');

router.get('/', exploreController.explore);

module.exports = router;
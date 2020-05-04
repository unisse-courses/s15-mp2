const router = require('express').Router();
const activityController = require ('../controllers/activityController');

router.get('/', activityController.activity);

module.exports = router;



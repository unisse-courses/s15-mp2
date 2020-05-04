const router = require('express').Router();
const profileController = require ('../controllers/profileController');

router.get('/', profileController.selfProfile);

router.get('/:username', profileController.profile);

module.exports = router;
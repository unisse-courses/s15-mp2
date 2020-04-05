const router = require('express').Router();
const usersModel = require ('../models/users');

router.get('/', function(req, res){
    res.render('profile',{
        title: "Your Profile"
    })
});

module.exports = router;
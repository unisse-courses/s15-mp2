const router = require('express').Router();

router.get('/', function(req, res){
    res.render('profile',{
        title: "Your Profile"
    })
});
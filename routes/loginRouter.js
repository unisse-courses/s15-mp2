const router = require('express').Router();
const usersModel = require ('../models/users');

router.get('/', function(req, res){
    res.render('login',{ 
        title: "Welcome to Lasell!",
        layout: "login"
    })
});

router.post('/validate', function(req, res){

    usersModel.findOne({email: req.body.email}, {password: req.body.password}, function(err, userResult){
        if(err) throw err;
        if (userResult){
            console.log("Login successful!");
            thisSession = req.session;
            thisSession.email = req.body.email;
            res.send("valid");
        }
        else{
            console.log("Login failed");
            res.send("");
        }
    });
});

router.post('/register', function(req, res){

    var newUser = new usersModel({
        username: req.body.username,
        email: req.body.email,
        img: req.body.img,
        password: req.body.password
    });

    usersModel.find({$or:[{username: req.body.username}, {email: req.body.email}]}, function(err, userResults){
        if(err) throw err;

        if (!userResults){
            console.log("Username/email already exists");
            res.send("");
        }
        else{
            newUser.save(function(err, newUser) {
                var result;
                if (err) {
                    console.log(err.errors);
                
                    result = "";
                    res.send(result);
                } else {
                    console.log("Successfully added student!");
                    console.log(newUser);

                    thisSession = req.session;
                    thisSession.email = req.body.email;

                    result = "valid";
                    res.send(result);
                }
            });
        }
    });
});

module.exports = router;
const usersModel = require ('../models/users');

exports.isLoggedIn = function(req, res, next) {
    if(req.session.email){
        res.redirect('/explore')
    } else {
        next();
    }
}

exports.login = function(req, res){
    res.render('login',{ 
        title: "Welcome to Lasell!",
        layout: "login"
    })
};

exports.logout = function(req, res){
    if (req.session) {
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    }
};

exports.validate = function(req, res){

    usersModel.findOne({email: req.body.email}, {password: req.body.password}, function(err, userResult){
        if(err) throw err;
        if (userResult){
            console.log("Login successful!");
            
            req.session.email = req.body.email;
            res.send("valid");
        }
        else{
            console.log("Login failed");
            res.send("");
        }
    });
};

exports.register = function(req, res){

    var newUser = new usersModel({
        username: req.body.username,
        email: req.body.email,
        img: req.body.img,
        password: req.body.password
    });

    usersModel.findOne({$or:[{username: req.body.username}, {email: req.body.email}]}, function(err, userResults){
        if(err) throw err;

        if (userResults){
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

                    req.session.email = req.body.email;

                    result = "valid";
                    res.send(result);
                }
            });
        }
    });
};
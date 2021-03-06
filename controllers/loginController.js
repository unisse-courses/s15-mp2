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
    usersModel.validateLogin(req.body.email, req.body.password, function(result){
        if(result){
            req.session.email = req.body.email;
            res.send("valid");
        } else {
            res.send("");
        }
    })
};

exports.register = function(req, res){
    usersModel.createUser(req.body.username, req.body.email, req.body.img, req.body.password, function(result){
        if(result){
            req.session.email = req.body.email;
            res.send("valid");
        } else {
            res.send("");
        }
    })
};
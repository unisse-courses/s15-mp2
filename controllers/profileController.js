const usersModel = require ('../models/users');
const auctionsModel = require ('../models/auctions');

exports.selfProfile = function(req, res){
    usersModel.getProfileByEmail(req.session.email, function(profile){
        console.log(profile);
        res.redirect('/profile/'+profile.username);
    });
};

exports.profile = function(req, res){
    console.log('username = '+ req.params.username);    
    usersModel.getProfileByUsername(req.params.username, function(profile){
        if(profile){
            auctionsModel.getAuctionsBySellerID(profile._id, function(auctions) {
                res.render('profile',{title: profile.username, profile, auctions})
            });
        } else {
            res.render('error',{title: "ERROR", message:"User does not exist:("})
        }
    });
};
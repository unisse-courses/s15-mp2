const usersModel = require ('../models/users');
const auctionsModel = require ('../models/auctions');
const watchedModel = require ('../models/watched');

exports.activity = function(req,res){

    var watched = [];
    var bids = [];

    usersModel.getProfileByEmail(req.session.email, function(profile){

        watchedModel.watched(profile._id, function(results){
            watched = results;
            
            auctionsModel.activeBids(profile._id, function(results){
                bids = results;
                
                res.render('activity',{title: "Activity", watched, bids})
            });
        });
    });
};



const router = require('express').Router();
const usersModel = require ('../models/users');
const auctionsModel = require ('../models/auctions');

router.get('/', function(req, res){
    usersModel.findOne({ email: req.session.email }, function(err, profile) {
        console.log(profile);
        res.redirect('/profile/'+profile.username);
    });
});

router.get('/:username', function(req, res){
    console.log('username = '+ req.params.username);
    usersModel.findOne({ username: req.params.username }, function(err, doc) {
        console.log(doc);
        var profile = doc.toObject();
    
        auctionsModel.find({sellerID: profile._id}, function(err, results) {
            if (err) throw err;
            console.log(results);
            var auctions = [];

            results.forEach(auction=>{
                auctions.push(auction.toObject());
            })

            res.render('profile',{title: profile.username, profile, auctions})
        })
    });
});

module.exports = router;
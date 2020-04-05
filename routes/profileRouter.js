const router = require('express').Router();
const usersModel = require ('../models/users');
const auctionsModel = require ('../models/auctions');

router.get('/', function(req, res){
    usersModel.findOne({ email: req.session.email }, function(err, doc) {
        console.log(doc);
        var profile = doc.toObject();
    
        auctionsModel.find({sellerEmail: profile.email}, function(err, results) {
            if (err) throw err;
            console.log(results);
            var auctions = [];

            results.forEach(auction=>{
                auctions.push(auction.toObject());
            })

            res.render('profile',{title: "Your Profile", profile, auctions})
        })
    });
});

module.exports = router;
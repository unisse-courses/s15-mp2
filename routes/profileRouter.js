const router = require('express').Router();
const usersModel = require ('../models/users');
const auctionsModel = require ('../models/auctions');

router.get('/', function(req, res){
    res.redirect('/profile/'+req.body.email);
});

router.get('/:id', function(req, res){
    usersModel.findOne({ email: req.param.email }, function(err, doc) {
        console.log(doc);
        var profile = doc.toObject();
    
        auctionsModel.find({sellerEmail: profile.email}, function(err, results) {
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
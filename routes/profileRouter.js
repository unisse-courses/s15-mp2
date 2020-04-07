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
        if (err) throw err;
        console.log(doc);
        var profile = doc.toObject();
    
        auctionsModel.find({sellerID: profile._id}, function(err, results) {
            if (err) throw err;
            console.log(results);
            var auctions = [];

            results.forEach(auction=>{
                var curAuction = auction.toObject()
                var dateObject = curAuction['expiryDate']
                var hours = ('0' + dateObject.getHours()).slice(-2);
                var minutes = ('0' + dateObject.getMinutes()).slice(-2);

                curAuction['expiryDate'] = curAuction.expiryDate.getFullYear()+"-"+
                                    ('0' + curAuction.expiryDate.getMonth()).slice(-2)+"-"+
                                    ('0' + curAuction.expiryDate.getDate()).slice(-2)+ " "+
                                            hours + ":" + minutes;
                auctions.push(curAuction);
            })

            res.render('profile',{title: profile.username, profile, auctions})
        })
    });
});

module.exports = router;
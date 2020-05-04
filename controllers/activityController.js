const router = require('express').Router();
const usersModel = require ('../models/users');
const auctionsModel = require ('../models/auctions');
const bidsModel = require ('../models/bids');
const watchedModel = require ('../models/watched');

router.get('/', function(req,res){

    var watched = [];
    var bids = [];

    usersModel.findOne({ email: req.session.email }, function(err, profile) {

        watchedModel.find({watcherID: profile._id}).populate('watcherID').populate('auctionID').exec(function(err, results) {
            if (err) throw err;
            
            results.forEach(watch => {
                var curWatch = watch.toObject()
                var curAuction = curWatch['auctionID'];
                var dateObject = curAuction['expiryDate']
                var hours = ('0' + dateObject.getHours()).slice(-2);
                var minutes = ('0' + dateObject.getMinutes()).slice(-2);
                curAuction['expiryDate'] = curAuction.expiryDate.getFullYear()+"-"+
                                    ('0' + curAuction.expiryDate.getMonth()).slice(-2)+"-"+
                                    ('0' + curAuction.expiryDate.getDate()).slice(-2)+ " "+
                                            hours + ":" + minutes;
                watched.push(curWatch);
            });

            auctionsModel.find({ highestBidderID: profile._id }, function(err, results) {
                if(err) throw err;

                results.forEach(auction => {
                    var curAuction = auction.toObject()
                    var dateObject = curAuction['expiryDate']
                    var hours = ('0' + dateObject.getHours()).slice(-2);
                    var minutes = ('0' + dateObject.getMinutes()).slice(-2);
                    curAuction['expiryDate'] = curAuction.expiryDate.getFullYear()+"-"+
                                        ('0' + curAuction.expiryDate.getMonth()).slice(-2)+"-"+
                                        ('0' + curAuction.expiryDate.getDate()).slice(-2)+ " "+
                                                hours + ":" + minutes;
                    bids.push(curAuction);
                });

                res.render('activity',{
                    title: "Activity",
                            watched,
                            bids
                })
            });
        });
    });
});

module.exports = router;



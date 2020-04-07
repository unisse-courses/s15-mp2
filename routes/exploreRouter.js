const router = require('express').Router();
const auctionsModel = require ('../models/auctions');

router.get('/', function(req, res){

    auctionsModel.find({}).populate('sellerID').sort({watchers: 1}).limit(100).exec(function(err, results){
        var auctions = [];
        results.forEach(function(doc){
            var curAuction = doc.toObject()
            var dateObject = curAuction['expiryDate']
            var hours = ('0' + dateObject.getHours()).slice(-2);
            var minutes = ('0' + dateObject.getMinutes()).slice(-2);

            curAuction['expiryDate'] = curAuction.expiryDate.getFullYear()+"-"+
                                ('0' + curAuction.expiryDate.getMonth()).slice(-2)+"-"+
                                ('0' + curAuction.expiryDate.getDate()).slice(-2)+ " "+
                                        hours + ":" + minutes;
            auctions.push(curAuction);
            console.log(auctions);
        })
        res.render('explore',{ title: "Explore", auctions})
    });
});

module.exports = router;
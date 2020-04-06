const router = require('express').Router();
const auctionsModel = require ('../models/auctions');

router.get('/', function(req, res){

    auctionsModel.find({}).populate('sellerID').sort({watchers: 1}).limit(100).exec(function(err, results){
        var auctions = [];
        results.forEach(function(doc){
            auctions.push(doc.toObject());
            console.log(auctions);
        })
        res.render('explore',{ title: "Explore", auctions})
    });
});

module.exports = router;
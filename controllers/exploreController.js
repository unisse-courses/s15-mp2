const auctionsModel = require ('../models/auctions');

exports.explore = function(req, res){
    auctionsModel.explore(function(result){
        var auctions = result;
        res.render('explore',{ title: "Explore", auctions})
    });
};
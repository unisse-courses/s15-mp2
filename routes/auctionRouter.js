const router = require('express').Router();
const auctionsModel = require ('../models/auctions');
const usersModel = require('../models/users');

router.get('/', function(req,res){
    res.render('create',{
        title: "Create Auction"
    })
});

router.post('/create', function(req, res){
    usersModel.findOne({email: req.session.email}, function(err, seller){
        console.log(seller);
        var sellerid = seller.toObject();
        var newAuction = new auctionsModel({
            sellerID: sellerid._id,
            productName:req.body.productName,
            description:req.body.description,
            delivery:req.body.delivery,
            contactNum:req.body.contactNum,
            expiryDate:req.body.expiryDate,
            startingBid:req.body.startingBid,
            highestBid:0,
            increments:req.body.increments,
            watchers:0,
            productImg:req.body.productImg,
            dateCreated: req.body.dateCreated
        })
        newAuction.save(function(err, newAuction) {
            var result;

            if (err) {
            console.log(err.errors);
        
            result = "Auction was not created!";
            res.send(result);
            } else {
            console.log("Successfully added auction!");
            console.log(newAuction);
            result = "Auction created!";
            res.send(result);
            }
        
        });
    });
});

router.get('/:id', function(req,res){

    //paedit nito ryan

    //para makuha mo yung id nung auction gamitin mo req.params.id

    auctionsModel.findOne({_id: req.params.id}), function(err, auction){
        res.render('auction',{
            title: auction.productName,
            auction: auction
        })
    }
});

module.exports = router;
const router = require('express').Router();
const auctionsModel = require ('../models/auctions');
const usersModel = require('../models/users');
const watchedModel = require ('../models/watched');

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
    console.log("going to auction :" + req.params.id)
    auctionsModel.findOne({_id: req.params.id}).populate('sellerID').exec(function(err, auction){
        console.log(auction);

        usersModel.findOne({email: req.session.email}, function(err, seller){
            console.log(seller);
            var currUser = seller.toObject();

            var currUserID = currUser._id;
            watchedModel.findOne({watchedID: currUserID },{auctionID: req.params.id}, function(err, auction){
                
                if (auction){
                    //yes, winawatch niya
                }
                else{
                    //no, hindi niya winawatch
                }
            });
        });
        

        







        var curAuction = auction.toObject()
        var dateObject = curAuction['expiryDate']
        var hours = ('0' + dateObject.getHours()).slice(-2);
        var minutes = ('0' + dateObject.getMinutes()).slice(-2);

        curAuction['expiryDate'] = curAuction.expiryDate.getFullYear()+"-"+
                            ('0' + curAuction.expiryDate.getMonth()).slice(-2)+"-"+
                            ('0' + curAuction.expiryDate.getDate()).slice(-2)+ " "+
                                    hours + ":" + minutes;

        res.render('auction',{
            title: auction.productName,
            auction: curAuction
        })
    }) 
});

module.exports = router;
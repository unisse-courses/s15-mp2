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
    auctionsModel.findOne({_id: req.params.id}).populate('sellerID').populate('highestBidderID').exec(function(err, auction){
        
        var curAuction = auction.toObject()
        var dateObject = curAuction['expiryDate']
        var hours = ('0' + dateObject.getHours()).slice(-2);
        var minutes = ('0' + dateObject.getMinutes()).slice(-2);

        curAuction['expiryDate'] = curAuction.expiryDate.getFullYear()+"-"+
                            ('0' + curAuction.expiryDate.getMonth()).slice(-2)+"-"+
                            ('0' + curAuction.expiryDate.getDate()).slice(-2)+ " "+
                                    hours + ":" + minutes;

        usersModel.findOne({email: req.session.email}, function(err, seller){
            console.log(seller.username);
            var currUser = seller.toObject();

            var currUserID = currUser._id;
            watchedModel.findOne({watcherID: currUserID, auctionID: req.params.id}, function(err, auction){
                
                if (auction){
                    //yes, winawatch niya
                    console.log("viewing watched auction");
                    res.render('auction',{
                        title: curAuction.productName,
                        auction: curAuction,
                        isWatched: true
                    })
                }
                else{
                    //no, hindi niya winawatch
                    console.log("current auction not watched");
                    res.render('auction',{
                        title: curAuction.productName,
                        auction: curAuction,
                        isWatched: false
                    })
                }
            });
        });      
    }) 
});

router.post('/watch', function(req, res){
    //find logged in userID via email
    usersModel.findOne({email: thisSession.email}, function(err, currUser){

        const currUserID = currUser._id;

        auctionsModel.findOneAndUpdate({ _id: req.body._id },{$inc: {watchers: 1}}, {new: true}, function(err, auction) {
            console.log(auction);

            const auctionid = auction._id;
            
            const watch = new watchedModel({
                watcherID: currUserID,
                auctionID: auctionid,
                watchedDate: new Date
            })

            watch.save(function(err, result){
                if(err) throw err;
                console.log(result);
                res.send("success");
            });
        });
    });
});

router.post('/unwatch', function(req, res){
    //find logged in userID via email
    usersModel.findOne({email: thisSession.email}, function(err, currUser){

        const currUserID = currUser._id;

        watchedModel.deleteOne({ auctionID: req.body._id },{watcherID: currUserID}, function(err, unwatch) {
            if(err) throw err;
            console.log(unwatch)
            console.log('Unwatch successful')
            res.send("success");
        });

        auctionsModel.findOneAndUpdate({ _id: req.body._id },{$inc: {watchers: -1}}, {new: true}, function(err, auction) {
            console.log("current watchers:"+auction.watchers);
        });


    });
});

router.post('/bid', function(req, res) {

    //find logged in userID via email
    usersModel.findOne({email: req.session.email}, function(err, currUser){

        const currUserID = currUser._id;
        const date = new Date();
        auctionsModel.findOne({ _id: req.body._id }, function(err, auction) {
            console.log("Bidding on:"+auction.productName);
            
            var curAuction = auction.toObject()

            console.log("highestBid:" + curAuction.highestBid)
            console.log("bidPrice:"+req.body.bidPrice)            
            if (curAuction.highestBid < req.body.bidPrice){
                const auctionid = auction._id;

                console.log("processing Bid");
            
                auctionsModel.findOneAndUpdate({_id: auctionid}, {$set: {highestBid: req.body.bidPrice, highestBidderID: currUserID, highestBidDate: date}}, {new: true}, function (err, updatedAuction){
                    if (err) throw err;
                    console.log("Highest bidder updated");
                    res.send(updatedAuction);
                });
            }
        });
    });
});


module.exports = router;
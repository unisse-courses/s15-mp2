const mongoose = require('mongoose');
const { databaseURL } = require('../config');

/** README **
  We need to set useFindAndModify to false because mongoose's findOneAndUpdate
  is using a deprecated function: findAndModify.
  This will suppress the warning.
**/
const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(databaseURL, options);

const auctionsSchema = new mongoose.Schema({
    sellerID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true },
    productName:{ type: String, required: [true, "No product name provided"] },
    description:{ type: String, required: [true, "No description provided"]},
    delivery:{ type: String, required: [true, "No delivery provided"] },
    contactNum:{ type: Number, required: [true, "No contact number provided"] },
    expiryDate:{ type: Date, required: [true, "No expiry date provided"] },
    startingBid:{ type: Number, required: [true, "No username provided"] },
    highestBid:{ type: Number, default: 0 },
    highestBidderID: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    highestBidDate: {type: Date},
    increments:{ type: Number, required: [true, "No increments provided"] },
    watchers:{ type: Number, default: 0 },
    productImg:{ type: String, required:true },
    dateCreated: { type: Date, default: Date.now, required:true },
  }
  /** README **
    Virtuals are other fields that do not persist in mongodb.
    By setting virtuals: true for toObject and toJSON, this makes all the
    Document.toObject() function include any virtuals value available.
    For our case, we don't have any.
  **/
  // }, {
  //   toObject: {
  //     virtuals: true,
  //   },
  //   toJSON: {
  //     virtuals: true,
  //   }
  // }
);

/** README **
  Export the model as the main content of this module.
**/

const auctionsModel = mongoose.model('auctions', auctionsSchema);

module.exports = mongoose.model('auctions', auctionsSchema);

module.exports.bid = function(auctionID, bidPrice, userID, date, next){
  auctionsModel.findOneAndUpdate({_id: auctionID}, {$set: {highestBid: bidPrice, highestBidderID: userID, 
                                  highestBidDate: date}}, {new: true}, function (err, updatedAuction){
    if (err) throw err;
    if(updatedAuction){
      console.log("Highest bidder updated");
      next(updatedAuction.toObject());
    } else {
      console.log("Unable to bid");
      next();
    }
  });
}
module.exports.createAuction = function(sellerID, productName, description, 
                                        delivery, contactNum, expiryDate, 
                                        startingBid, increments, productImg, next){
  var newAuction = new auctionsModel({
      sellerID: sellerID,
      productName: productName,
      description: description,
      delivery: delivery,
      contactNum: contactNum,
      expiryDate: expiryDate,
      startingBid: startingBid,
      highestBid: 0,
      increments: increments,
      watchers:0,
      productImg: productImg,
  })

  newAuction.save(function(err, newAuction) {
      var result;
      if (err) {
        console.log(err.errors);
        console.log("Auction was not created!");
        next();
      } else {
        console.log("Successfully added auction!");
        console.log(newAuction);
        result = newAuction.toObject();
        next(result._id);
      }
  });

};

module.exports.watchAuction = function(_id, next){
  auctionsModel.findOneAndUpdate({ _id: _id },{$inc: {watchers: 1}}, {new: true}, function(err, auction) {
    if (err) throw err;
    if(auction){
      next(auction.toObject());
    } else {
      next();
    }
  });
}

module.exports.unwatchAuction = function(_id, next){
  auctionsModel.findOneAndUpdate({ _id: _id },{$inc: {watchers: -1}}, {new: true}, function(err, auction) {
    if (err) throw err;
    if(auction){
      next(auction.toObject());
    } else {
      next();
    }
  });
}

module.exports.getAuctionByID = function( _id, next){
  auctionsModel.findOne({_id: _id}).populate('sellerID').populate('highestBidderID').exec(function(err, auction){
    if (err) throw err;
    if(auction){
      var curAuction = auction.toObject()
      var dateObject = curAuction['expiryDate']
      var hours = ('0' + dateObject.getHours()).slice(-2);
      var minutes = ('0' + dateObject.getMinutes()).slice(-2);
      curAuction['expiryDate'] = curAuction.expiryDate.getFullYear()+"-"+
                          ('0' + curAuction.expiryDate.getMonth()).slice(-2)+"-"+
                          ('0' + curAuction.expiryDate.getDate()).slice(-2)+ " "+
                                  hours + ":" + minutes;
      next(curAuction);
    } else {
      next();
    }
  });
}

module.exports.getAuctionsBySellerID = function(_id, next){
  auctionsModel.find({sellerID: _id}, function(err, results) {
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
    });
    next(auctions);
  });
};

module.exports.explore = function(next){
  auctionsModel.find({expiryDate: {$gt: new Date()}}).populate('sellerID').sort({watchers: 1}).limit(100).exec(function(err, results){
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
    });
    next(auctions);
  });
};

module.exports.activeBids = function(_id ,next){
  auctionsModel.find({ highestBidderID: _id }, function(err, results) {
    if(err) throw err;
    var bids = [];
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
    next(bids);
  });
};


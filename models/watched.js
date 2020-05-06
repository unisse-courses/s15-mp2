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

const watchedSchema = new mongoose.Schema({
    watcherID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true },
    auctionID: { type: mongoose.Schema.Types.ObjectId, ref: 'auctions', required:true },
    watchedDate: { type: Date, required: true }
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

watchedModel =  mongoose.model('watched', watchedSchema);

module.exports = mongoose.model('watched', watchedSchema);

module.exports.watched = function(_id ,next){
  watchedModel.find({watcherID: _id}).populate('watcherID').populate('auctionID').exec(function(err, results) {
    if (err) throw err;
    var watched = [];
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
    next(watched);
  });
} 

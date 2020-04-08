const mongoose = require('mongoose');

const databaseURL = 'mongodb://localhost:27017/laselldb';

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
    highestBidderID: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true },
    highestBidDate: {type: Date, required:true},
    increments:{ type: Number, required: [true, "No increments provided"] },
    watchers:{ type: Number, default: 0 },
    productImg:{ type: String, required:true },
    dateCreated: { type: Date, required:true },
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
module.exports = mongoose.model('auctions', auctionsSchema);

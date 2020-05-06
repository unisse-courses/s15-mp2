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

const usersSchema = new mongoose.Schema({
    username: { type: String, required: [true, "No username provided"] },
    email: { type: String, required: [true, "No email provided"] },
    img: { type: String, required: true },
    password : { type: String, required: [true, "No password provided"] }
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

const usersModel = mongoose.model('users', usersSchema);

module.exports = mongoose.model('users', usersSchema);

module.exports.validateLogin = function(email, password, next) {
  usersModel.findOne({email: email}, {password: password}, function(err, userResult){
    if(err) throw err;
    if (userResult){
        console.log("Login successful!");
        next("valid");
    }
    else{
        console.log("Login failed");
        next();
    }
  });
};

module.exports.createUser = function(username, email, img, password, next){

  var newUser = new usersModel({
    username: username,
    email: email,
    img: img,
    password: password
  });

  usersModel.findOne({$or:[{username: username}, {email: email}]}, function(err, userResults){
      if(err) throw err;

      if (userResults){
          console.log("Username/email already exists");
          next();
      }
      else{
          newUser.save(function(err, newUser) {
              var result;
              if (err) {
                  console.log(err.errors);
              
                  result = "";
                  next();
              } else {
                  console.log("Successfully added student!");
                  console.log(newUser);

                  result = "valid";
                  next(result);
              }
          });
      }
  });
}


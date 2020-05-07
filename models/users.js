const bcrypt = require('bcrypt');
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

module.exports.getProfileByEmail = function(email, next){
  usersModel.findOne({ email: email }, function(err, profile) {
    if(err) throw err;
    if(profile){
      next(profile.toObject());
    } else {
      next();
    }
  });
};

module.exports.getProfileByUsername = function(username, next){
  usersModel.findOne({ username: username }, function(err, profile) {
    if(err) throw err;
    if(profile){
      next(profile.toObject());
    } else {
      next();
    }
  });
};

module.exports.validateLogin = function(email, password, next) {
  usersModel.findOne({email: email}, function(err, userResult){
    if(err) throw err;

    if(userResult){
      bcrypt.compare(password, userResult.password, (err, result) =>{
        if (userResult && result){
          console.log("Login successful!");
          next("valid");
        }
        else{
            console.log("Login failed");
            next();
        }
      })
    } else {
        next();
    }
  });
};

module.exports.createUser = function(username, email, img, password, next){

  usersModel.findOne({$or:[{username: username}, {email: email}]}, function(err, userResults){
      if(err) throw err;

      if (userResults){
          console.log("Username/email already exists");
          next();
      }
      else{

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hashed) =>{
          
          const newhashed = new usersModel({
            username: username,
            email: email,
            img: img,
            password: hashed
          });
          newhashed.save(function(err, newUser) {
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
        });

          
      }
  });
}


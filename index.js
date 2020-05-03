const express = require("express");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const hbs = require("express-handlebars");
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();
const port = 3000;

const mongoose = require('./models/connection');
const usersModel = require ('./models/users');
const auctionsModel = require ('./models/auctions');
const bidsModel = require ('./models/bids');
const watchedModel = require ('./models/watched');

const login = require('./routes/loginRouter');
const profile = require('./routes/profileRouter');
const explore = require('./routes/exploreRouter');
const auction = require('./routes/auctionRouter');
const activity = require('./routes/activityRouter');

app.use(cookieParser());
app.use(session({
    secret: "sikretong malupet",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

var thisSession;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

app.use(express.static("public"));

app.listen(port, function(){
    console.log("listening to port " + port);
});

var minBid = function(highestBid, startingBid, increments){
    if(highestBid < startingBid)
        return startingBid;
    else
        return highestBid + increments;
};

app.engine('hbs', hbs({
    helpers: {
        minBid: minBid
    },
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'hbs');

app.use(function(req, res, next) {
    thisSession = req.session;
    next();
}); 

const checkLogIn = function(req, res, next) {
    if(thisSession.email){
        next();
    } else {
        res.redirect('/login');
    }
}

app.use('/login', login);
app.use('/explore', checkLogIn, explore);
app.use('/profile', checkLogIn, profile);
app.use('/auction', checkLogIn, auction);
app.use('/activity', checkLogIn, activity);

app.get('/', function(req, res){
    res.redirect('/login');
});

var brian = new usersModel({
    username: "brianSo",
    email:  "brian_jezreel_so@dlsu.edu.ph",
    img: "/testimages/brian_dp.jpg",
    password: "abc"
});

var ryan = new usersModel({
    username: "ryanSarabia",
    email:  "ryan_miguel_sarabia@dlsu.edu.ph",
    img: "/testimages/ryan_dp.jpg",
    password: "abc"
});

usersModel.findOne({username: 'ryanSarabia'}, function(err, users){

    if(err){
        brian.save(function(err, newUser) {
            var result;
            if (err) {
                console.log(err.errors);
                result = "";
                res.send(result);
            } else {
                console.log("Successfully added student!");
                console.log(newUser)
            }
        });
        
        ryan.save(function(err, newUser) {
            var result;
            if (err) {
                console.log(err.errors);
                result = "";
                res.send(result);
            } else {
                console.log("Successfully added student!");
                console.log(newUser)
            }
        });
    }

});


auctionsModel.findOne({}, function(err, auctions){
    if (!auctions){
        usersModel.findOne({email: "brian_jezreel_so@dlsu.edu.ph"}, function(err, brian){
        
            var newAuction = new auctionsModel({
                sellerID: brian._id,
                productName: "Realistic Lightup Pokeballs",
                description: "These flashy balls are sure to catch anyone's heart",
                delivery: "Taft avenue DLSU north gate",
                contactNum:"639296439999",
                expiryDate: new Date("10-13-2020 12:00"),
                startingBid: 200,
                highestBid:0,
                increments: 50,
                watchers:0,
                productImg:"/testimages/pokeballs.jpg",
                dateCreated: new Date
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
                }
            });
        });

        usersModel.findOne({email: "ryan_miguel_sarabia@dlsu.edu.ph"}, function(err, ryan){
        
            var newAuction = new auctionsModel({
                sellerID: ryan._id,
                productName: "Pacemaker",
                description: "Heart pacemaker, used but not abused; condition = 8.73/10",
                delivery: "Meet up at Taft/MoA area",
                contactNum:"639296439998",
                expiryDate: new Date("12-13-2020 12:00"),
                startingBid: 500,
                highestBid:0,
                increments: 50,
                watchers:0,
                productImg:"/testimages/pacemaker.jpg",
                dateCreated: new Date
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
                }
            });
        });
    }
})

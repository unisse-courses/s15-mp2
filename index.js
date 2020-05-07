const express = require("express");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const hbs = require("express-handlebars");
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const { envPort, sessionKey } = require('./config');


const app = express();
const port = envPort || 3000;

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
    secret: sessionKey,
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

var isClosed = function(expiryDate, options){
    if(new Date(expiryDate) <= new Date()){ // closed
        return options.fn(this);
    } else {                                // not closed
        return options.inverse(this);
    }
}

app.engine('hbs', hbs({
    helpers: {
        minBid: minBid,
        isClosed: isClosed
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
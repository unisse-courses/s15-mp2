const express = require("express");
const hbs = require("express-handlebars");
const mongodb = require('mongodb');

const app = express();
const port = 3000;


const mongoClient = mongodb.MongoClient;
const databaseURL = "mongodb://localhost:27017/";
const dbname = "laselldb";
const options = { useUnifiedTopology: true };

/* DATA */
var auctions = [
    {
        sellerName: "meriendacosgrove",
        location: "Pasay City",
        sellerImg: "images/merienda_dp.jpg",
        rating: 4.52,
        productName: "Chestplate",
        productImg: "images/chestplate.jpg",
        categories: ["home", "living", "furniture"],
        expiryDate: "April 30, 2020",
        expiryTime: "23:00",
        bidPrice: 25.00,
        watchers: 21
    },
    {
        sellerName: "baboi",
        location: "Pig farm"
    },
    {
        sellerName: "baboi"
    },
    {
        sellerName: "baboi"
    }
]
/* END OF DATA */

app.use(express.static("public"));

app.listen(port, function(){
    console.log("listening to port " + port);
});

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'hbs');

app.get(['/','/login'], function(req, res){
    res.render('login',{ 
        title: "Login/Register",
        layout: "login"
    })
});

//Create collections (entities)
mongoClient.connect(databaseURL, options, function(err, client) {
   
    if (err) throw err;
    const dbo = client.db(dbname);
  
    //Will create collections if it has not yet been made
    dbo.createCollection("users", function(err, res) {
      if (err) throw err;
      console.log("users created!");
      client.close();
    });
    dbo.createCollection("ratings", function(err, res) {
        if (err) throw err;
        console.log("ratings created!");
        client.close();
    });
    dbo.createCollection("watched", function(err, res) {
        if (err) throw err;
        console.log("watched created!");
        client.close();
    });
    dbo.createCollection("auctions", function(err, res) {
        if (err) throw err;
        console.log("auctions created!");
        client.close();
    });
    dbo.createCollection("bids", function(err, res) {
        if (err) throw err;
        console.log("bids created!");
        client.close();
    });    
  });

//CRUD

//Register (Create on users)

//Log in (Read on users)

//Add item for auction (receive user's username/update on user/create on auctions)

//Bid on auction (receive user's username/create on bids/update on auctions)

//Watch an auction (receive user's username/receive auction item's name/create on watched/update on auctions)

//Search based on categories(read on auctions [use query an array with embedded documents])

//View auction(read on bids/read on watched/read on auctions)

//Delete auction(delete on auctions)

//View self profile(read on bids/read on watched/read on auctions)

//view others profile(read on user/read on auctions)

//rate user(receivecreate on ratings)


// app.get('/post/:auctionID', function(req,res){
//     res.render
app.get('/explore', function(req, res){
    res.render('explore',{
        title: "Explore",
        auctions
    })
});

app.get('/auction/:id', function(req,res){
    res.render('auction',{
        title: auctions[req.params.id].productName,
        auction: auctions[req.params.id]
    })
});


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

app.get('/', function(req, res){
    res.render('login',{ 
        title: "Login/Register",
        layout: "login"
    })
});

//Create collections (entities)
mongoClient.connect(databaseURL, options, function(err, client) {
    /**
      Only do database manipulation inside of the connection
      When a connection is made, it will try to make the database
      automatically. The collection(like a table) needs to be made.
    **/
    if (err) throw err;
    const dbo = client.db(dbname);
  
    //Will create a collection if it has not yet been made
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

//Create
// mongoClient.connect(databaseURL, function(err, client){

//     if(err) throw err;
//     const dbo = client.db("laselldb");

//     const collection = dbo.collection("nameOfEntity");

//     //insertOne for single, insertMany for array
//     collection.insertOne(data,/*, [options], */function(err, res){
//         if(err) throw err;
//         console.log("Insert Successful!");
//         client.close();
//     })

// })

//Read
//findOne = retrieves first match
//find = creates cursor for query to iterate over all results
//findOneAndDelete
//findOneAndReplace
//findOneAndUpdate = one step to delete/replace/update
//queryObj in the form {field: 'value'}
// mongoClient.connect(databaseURL, function(err,client){
//     if(err) throw err;

//     const dbo = client.db("laselldb");

//     dbo.collection("nameOfEntity").findOne(queryObj, /*, [options], */ function(err, res){
//     //dbo.collection("nameOfEntity").find({}).toArray(function(err, res){
//         if(err) throw err;
//         console.log(res); //Prints out the document/array of documents
//         client.close();
//     })
// })


// app.get('/post/:auctionID', function(req,res){
//     res.render
=======
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


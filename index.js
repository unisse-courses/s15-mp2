const express = require("express");
const hbs = require("express-handlebars");
const mongodb = require('mongodb');

const app = express();
const port = 3000;

const mongoClient = mongodb.MongoClient;
const databaseURL = "mongodb://localhost:27017/";
const dbname = "laselldb";

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

app.get('/home', function(req, res){
    res.render('home',{
        title: "Home",
        auctions: [
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
    })
});


//Create collections (entities)
mongoClient.connect(databaseURL, function(err, db){

    if(err) throw err;
    const dbo = db.db("laselldb");

    dbo.createCollection("students", function(err, res){
        if (err) throw err;
        console.log ("Collection created!");
        db.close();
    })

})

//CRUD

//Create
mongoClient.connect(databaseURL, function(err, client){

    if(err) throw err;
    const dbo = client.db("laselldb");

    const collection = dbo.collection("nameOfEntity");

    //insertOne for single, insertMany for array
    collection.insertOne(data,/*, [options], */function(err, res){
        if(err) throw err;
        console.log("Insert Successful!");
        client.close();
    })

})

//Read
//findOne = retrieves first match
//find = creates cursor for query to iterate over all results
//findOneAndDelete
//findOneAndReplace
//findOneAndUpdate = one step to delete/replace/update
//queryObj in the form {field: 'value'}
mongoClient.connect(databaseURL, function(err,client){
    if(err) throw err;

    const dbo = client.db("laselldb");

    dbo.collection("nameOfEntity").findOne(queryObj, /*, [options], */ function(err, res){
    //dbo.collection("nameOfEntity").find({}).toArray(function(err, res){
        if(err) throw err;
        console.log(res); //Prints out the document/array of documents
        client.close();
    })
})


// app.get('/post/:auctionID', function(req,res){
//     res.render

// }


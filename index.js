const express = require("express");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const hbs = require("express-handlebars");
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(session({secret: "sikretong malupet"}));
var thisSession;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoClient = mongodb.MongoClient;
const databaseURL = "mongodb://localhost:27017/";
const dbname = "laselldb";
const options = { useUnifiedTopology: true };

/* DATA */
var auctions = [
    {
        sellerName: "meriendacosgrove",
        location: "Pasay City",
        sellerImg: "/images/merienda_dp.jpg",
        rating: 4.52,
        contactNum: "09554321234",
        productName: "Chestplate Na Pwede Gawing Stool",
        productImg: "/images/chestplate.jpg",
        categories: ["home", "living", "furniture"],
        expiryDate: "April 30, 2020",
        expiryTime: "23:00",
        description: `  Perfect item for those who want the minimalist look
                        with a touch of nature. Chair is very sturdy and can 
                        hold up to 100kg of weight. I can deliver your the item
                        via Lalamove or we can meet up @ Taft.
                        Increments of 20`,
        bidPrice: 25.00,
        startPrice: 20.00,
        watchers: 21,
        delivery: "Meetup @ Taft, Lalamove"
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

function checkLogIn (req, res, next) {
    thisSession = req.session;
    if(thisSession.email){
        next();
    } else {
        res.redirect('/login');
    }
}

app.get(['/','/login'], function(req, res){
    res.render('login',{ 
        title: "Login/Register",
        layout: "login"
    })
});

app.post('/validateLogin', function(req, res){
    var valid = true;
    mongoClient.connect(databaseURL, options, function(err, client) {
        if(err) throw err;
        // Connect to the same database
        const dbo = client.db(dbname);
      
        dbo.collection("users").find({$or: [{ username: req.body.username }, { email: req.body.email }]}).limit(1).toArray(function(err, result) {
            if(err) throw err;
        
            console.log(result);
            console.log("Read Successful!");

            
            if (result.length == 0){
                console.log("Log in invalid");
                client.close();
                res.end("");
            }
            else{
                console.log("Log in successful");
                client.close();
                thisSession = req.session;
                thisSession.email = req.body.email;
                res.send("valid");

            }  
        });
      });
    //do everything below only if valid
    // if(valid){
    //     thisSession = req.session;
    //     thisSession.email = req.body.email;
    //     res.end("valid"); 
    // }
})

app.post('/validateRegister', function(req, res){

    const newUser = {
        username: req.body.username,
        email: req.body.email,
        img: req.body.img,
        password: req.body.password
    }

    mongoClient.connect(databaseURL, options, function(err, client) {
        if(err) throw err;
        // Connect to the same database
        const dbo = client.db(dbname);
      
        dbo.collection("users").find({$or: [{ username: req.body.username }, { email: req.body.email }]}).limit(1).toArray(function(err, result) {
            if(err) throw err;
        
            console.log(result);
            console.log("Read Successful!");

            
            if (result.length == 0){
                dbo.collection("users").insertOne(newUser, function(err, res) {
                    if (err) throw err;

                    console.log(res);
                    console.log("Insert Successful!");
                  
                    client.close();
                  });

                thisSession = req.session;
                thisSession.email = req.body.email;
                res.end("valid");
            }

            else{
                console.log("Registration invalid");
                client.close();
                res.send("");

            }
        });
      });

    // if(valid){
    //     thisSession = req.session;
    //     thisSession.email = req.body.email;
    //     res.end("valid"); 
    // }
})

app.get('/explore', checkLogIn, function(req, res){
    res.render('explore',{
        title: "Explore",
        auctions
    })
});

app.get('/create', checkLogIn, function(req,res){
    res.render('create',{
        title: "Create Auction"
    })
});

app.post('/createAuction', checkLogIn, function(req, res){
    var newAuction = {
        productName:req.body.productName,
        description:req.body.description,
        delivery:req.body.delivery,
        contactNum:req.body.contactNum,
        expiryDate:req.body.expiryDate,
        expiryTime:req.body.expiryTime,
        startingBid:req.body.startingBid,
        increments:req.body.increments,
        productImg:req.body.productImg
    }

    mongoClient.connect(databaseURL, options, function(err, client) {
        if(err) throw err;
        // Connect to the same database
        const dbo = client.db(dbname);
      
        dbo.collection("auctions").insertOne(newAuction, function(err, res) {
          if (err) throw err;
        
          console.log(res);
          console.log("Insert Successful!");
        
          client.close();
        });
    });

    
})

app.get('/auction/:id', checkLogIn, function(req,res){
    res.render('auction',{
        title: auctions[req.params.id].productName,
        auction: auctions[req.params.id]
    })
});

app.get('/activity', checkLogIn, function(req,res){
    res.render('activity',{
        title: "Activity",
        watched: auctions,
        bids: auctions,
    })
});


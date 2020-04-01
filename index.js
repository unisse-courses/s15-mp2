const express = require("express");
const hbs = require("express-handlebars");

const app = express();
const port = 3000;

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

app.get('/', function(req, res){
    res.render('login',{ 
        title: "Login/Register",
        layout: "login"
    })
});

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


const express = require("express");
const hbs = require("express-handlebars");

const app = express();
const port = 3000;

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

// app.get('/post/:auctionID', function(req,res){
//     res.render

// }


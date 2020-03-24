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
                name: "Merienda Cosgrove",
                location: "Pasay City",
                img: "images/merienda_dp.jpg",
                rating: 4.5
            },
            {
                name: "baboi"
            }
        ]
    })
});
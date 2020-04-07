const router = require('express').Router();

router.get('/activity', function(req,res){

    res.render('activity',{
        title: "Activity"
        // watched,
        // bids,
    })
});

module.exports = router;



const router = require('express').Router();
const auctionController = require ('../controllers/auctionController');

router.get('/', auctionController.auction);

router.post('/create', auctionController.create);

router.get('/:id', auctionController.getAuctionByID);

router.post('/watch', auctionController.watch);

router.post('/unwatch', auctionController.unwatch);

router.post('/bid', auctionController.bid);

module.exports = router;
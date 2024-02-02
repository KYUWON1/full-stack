const express = require('express');

const quoteController = require('../controllers/quotes-controllers');

const router = express.Router();

router.get("/", quoteController.getRandomQuote);

module.exports = router;
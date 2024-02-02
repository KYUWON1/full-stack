const Quote = require('../models/quotes-models');

async function getRandomQuote(req,res,next) {
    const randomQuote = await Quote.getRandomQuote();
    
    res.json({
      quote: randomQuote,
    });
}

module.exports = {
  getRandomQuote: getRandomQuote,
};
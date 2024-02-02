const db = require('../data/database');

class Quote {
    static async getRandomQuote(){
        const quotes = await db.getDb().collection('quotes').find().toArray();
        //밑에 함수를 통해, 배열의 랜덤인덱스에 접근할수있음. 0~0.9999선택하고 x 길이 1,2,3이면 n-1길이나옴
        const randomQuoteIndex = Math.floor(Math.random() * quotes.length); 

        const randomQuote = quotes[randomQuoteIndex];

        return randomQuote.text;
    }
}

module.exports = Quote;
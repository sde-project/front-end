import { getAllBestExchanges } from "../modules/exchanges.js";

const CRYPTOS = ['BTC', 'ETH', 'LTC', 'DOGE', 'DOT', 'SOL', 'XRP', 'LUNA', 'AVAX', 'BNB'];

$("#exchanges-cards").ready(() => {
    getAllBestExchanges()
    .then(resp => {
        CRYPTOS.forEach(crypto => {
            var bestBuy = resp[crypto]['buy'].exchange;
            var bestBuyId = '#'+crypto.toLowerCase()+'-'+bestBuy.toLowerCase().replace('.', '');
            $(bestBuyId).append('<span class="badge bg-primary rounded-pill">best buy!</span>');
            var bestSell = resp[crypto]['sell'].exchange;
            var bestSellId = '#'+crypto.toLowerCase()+'-'+bestSell.toLowerCase().replace('.', '');
            $(bestSellId).append('<span class="badge bg-success rounded-pill">best sell!</span>');
        })
    })
    .catch(err => console.log(err));
});
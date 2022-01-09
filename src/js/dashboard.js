import { getCryptoLatestGraph } from "../modules/graph.js"
import { getExchangesUserBuy } from "../modules/exchanges.js"
import { getExchangesUserSell } from "../modules/exchanges.js"
import http from "../modules/http.js";

$(document).ready(function () {
    feather.replace({ 'aria-hidden': 'true' });

    http.get("/users/me").then(async function (response) {
        if (response.status == 200) {

            const user = await response.json();

            $("#dashboard-text").text(`${user.username}'s Dashboard`);

            console.log(user.cryptos);

            if (user.cryptos.length > 0) {
                $('#trending-favourite').text(`Trending Favourite: ${user.cryptos[0]}`)
                getCryptoLatestGraph(user.cryptos[0], 'buy')
                    .then(res => {
                        $('#loading').remove();
                        var newCanvas = $('<canvas/>', {
                            'class': 'my-4 w-100',
                            id: 'myChart'
                        });
                        $('#canvas').append(newCanvas);
                        var ctx = newCanvas.get(0).getContext('2d');
                        if (newCanvas.width() < 1000) {
                            res.options.plugins.annotation.annotations.forEach(element => {
                                element.label.enabled = false;
                            });
                        }
                        myChart = new Chart(ctx, res);
                    });
            } else {
                getCryptoLatestGraph("BTC", 'buy')
                    .then(res => {
                        $('#loading').remove();
                        var newCanvas = $('<canvas/>', {
                            'class': 'my-4 w-100',
                            id: 'myChart'
                        });
                        $('#canvas').append(newCanvas);
                        var ctx = newCanvas.get(0).getContext('2d');
                        if (newCanvas.width() < 1000) {
                            res.options.plugins.annotation.annotations.forEach(element => {
                                element.label.enabled = false;
                            });
                        }
                        myChart = new Chart(ctx, res);
                    });
            }

        } else {
            console.log("Error getting user");
            alert("Error getting user");
        }
    });
});

$("#exchanges-dashboard").ready(() => {
    Promise.all([getExchangesUserBuy(), getExchangesUserSell()])
        .then(([bestBuy, bestSell]) => {
            var cryptos = [];
            var bestExchanges = {};

            bestBuy.forEach(price => {
                //console.log('best buy ' + price.crypto + ' = ' + price.exchange + ' at ' + price.price + '$');
                cryptos.push(price.crypto);
                bestExchanges[price.crypto] = {}
                bestExchanges[price.crypto]['buy'] = {};
                bestExchanges[price.crypto]['buy']['exchange'] = price.exchange;
                bestExchanges[price.crypto]['buy']['price'] = price.price;
            });

            bestSell.forEach(price => {
                //console.log('best sell ' + price.crypto + ' = ' + price.exchange + ' at ' + price.price + '$');
                bestExchanges[price.crypto]['sell'] = {};
                bestExchanges[price.crypto]['sell']['exchange'] = price.exchange;
                bestExchanges[price.crypto]['sell']['price'] = price.price;
            });

            if(cryptos.length > 0) {
                cryptos.forEach(crypto => {
                    var img;
                    switch (crypto) {
                        case 'BTC':
                            img = 'bitcoin.png';
                            break;
                        case 'ETH':
                            img = 'ethereum.png';
                            break;
                        case 'BNB':
                            img = 'binance.png';
                            break;
                        case 'DOGE':
                            img = 'doge.png';
                            break;
                        case 'AVAX':
                            img = 'avalanche.png';
                            break;
                        case 'LTC':
                            img = 'litecoin.png';
                            break;
                        case 'LUNA':
                            img = 'luna.png';
                            break;
                        case 'DOT':
                            img = 'polkadot.png';
                            break;
                        case 'XRP':
                            img = 'proton.png';
                            break;
                        case 'SOL':
                            img = 'solana.png';
                            break;
                        default:
                            break;
                    }
    
                    const card = '<div class="col"><div class="card pt-2 m-1 text-center"><img class="card-img-top" src="/assets/' + img + '">' + 
                    '<div class="card-body"><h5 class="card-title"><b>' + crypto + '</b></h5></div>' + 
                    '<ul class="list-group list-group-flush">' +
                    '<li class="list-group-item">Buy on '+bestExchanges[crypto]['buy']['exchange']+' at '+bestExchanges[crypto]['buy']['price']+'$</li>'+
                    '<li class="list-group-item">Sell on '+bestExchanges[crypto]['sell']['exchange']+' at '+bestExchanges[crypto]['sell']['price']+'$</li>'+
                    '</ul></div></div>';
    
                    $("#exchanges-dashboard").append(card);
                });
            } else {
                $("#exchanges-container").append('<p>Please let us know your favourite crypto-currencies!</p>');
            }

            
        })
});
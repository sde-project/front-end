import { getCryptoLatestGraph } from "../modules/graph.js"
import http from "../modules/http.js";

$(document).ready(function() {
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
                        var newCanvas = $('<canvas/>',{
                            'class':'my-4 w-100',
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
                        var newCanvas = $('<canvas/>',{
                            'class':'my-4 w-100',
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
})
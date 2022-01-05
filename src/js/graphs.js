import { getCryptoLatestGraph } from "../modules/graph.js";
import User from "../modules/user.js";
import http from "../modules/http.js";

const likeSVG = `<span class="pe-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16"> <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" /> </svg></span>`;

const user = await User.getMe();

$(document).ready(async function() {
    
    user.cryptos.forEach(crypto => {
        $(`#${crypto}-like`).removeClass("btn-outline-danger");
        $(`#${crypto}-like`).addClass("btn-danger");
        $(`#${crypto}-like`).html(`${likeSVG}Dislike`);
    });

});

$(".like-button").click(async function() {
    const crypto = $(this).attr("data-crypto");
    const isLiked = $(this).hasClass('btn-danger');

    if (isLiked) {
        $(`#${crypto}-like`).removeClass("btn-danger");
        $(`#${crypto}-like`).addClass("btn-outline-danger");
        $(`#${crypto}-like`).html(`${likeSVG}Like`);
        
        user.crypto = user.cryptos.filter(c => c !== crypto);
    } else {
        $(`#${crypto}-like`).removeClass("btn-outline-danger");
        $(`#${crypto}-like`).addClass("btn-danger");
        $(`#${crypto}-like`).html(`${likeSVG}Dislike`);
        
        user.cryptos.push(crypto);
    }

    await user.save();
});

var myChart;
$('#cryptoModal').on('hidden.bs.modal', function () {
    myChart.destroy();
    $('#myChart').remove();
    $('#loading-container').html(`
    <div class="w-100 d-flex justify-content-center align-items-center loader"
        style="height: 75vh;">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            style="margin: auto; background: rgb(0, 0, 0, 0.0) none repeat scroll 0% 0%; display: block; shape-rendering: auto;"
            width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <path fill="none" stroke="#410d0c" stroke-width="8"
                stroke-dasharray="42.76482137044271 42.76482137044271"
                d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
                stroke-linecap="round" style="transform:scale(0.8);transform-origin:50px 50px">
                <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="2s"
                    keyTimes="0;1" values="0;256.58892822265625"></animate>
            </path>
        </svg>
    </div>
    `);
});

$('#cryptoModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var crypto = button.data('crypto') // Extract info from data-* attribute
    var modal = $(this);
    modal.find('#cryptoModalLabel').text(crypto + " chart");
    
    // Generate graph
    // var ctx = document.getElementById('myChart');
    getCryptoLatestGraph(crypto.replaceAll('@', ''))
        .then(res => {
            $('.loader').get(0).remove();
            var newCanvas = $('<canvas/>',{
                class:'my-4 w-100',
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
        })
})
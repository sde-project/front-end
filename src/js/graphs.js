import { getCryptoLatestGraph } from "../modules/graph.js";

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
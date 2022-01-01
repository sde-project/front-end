import { getCryptoLatestGraph } from "../modules/graph.js";

var myChart;
$('#cryptoModal').on('hidden.bs.modal', function () {
    myChart.destroy();
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
            $('#loading').remove();
            var newCanvas = $('<canvas/>',{
                'class':'my-4 w-100',
                id: 'myChart'               
            });
            $('#canvas').append(newCanvas);
            var ctx = newCanvas.get(0).getContext('2d');
            myChart = new Chart(ctx, res);
        })
})
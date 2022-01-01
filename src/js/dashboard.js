import { getCryptoLatestGraph } from "../modules/graph.js"


$(document).ready(function() {
  feather.replace({ 'aria-hidden': 'true' })

  // Graphs
  getCryptoLatestGraph("BTC")
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
})
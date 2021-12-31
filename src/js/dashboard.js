import { getCryptoLatestGraph } from "../modules/graph.js"


$(document).ready(function() {
  feather.replace({ 'aria-hidden': 'true' })

  // Graphs
  var ctx = document.getElementById('myChart');
  getCryptoLatestGraph("BTC")
      .then(res => {
          myChart = new Chart(ctx, res);
      });
})
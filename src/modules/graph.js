import config from './config.js';
import http from './http.js';

export function getCryptoLatestGraph(crypto) {
    let toDate = new Date();
    toDate.setDate(toDate.getDate()-1);
    let fromDate = new Date();
    fromDate.setDate(fromDate.getDate()-30);
    return http.get(`${config.graph_api}/graph/configuration?currency=${crypto}&from=${fromDate.toISOString()}&to=${toDate.toISOString()}`).then(response => {
        if (response.status == 200) {
            return response.json().then(data => {
                return data;
            });
        } else {
            return response.json().then(data => {
                console.log("There was an error getting the graph!");
                console.log(data);
                throw new Error(data.error);
            });
        }
    });
}

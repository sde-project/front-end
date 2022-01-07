import http from './http.js';

export function getAllBestExchanges () {
    return http.get('https://cryptodashboard.it/exchanges/best/all')
    .then(response => response.json())
    .catch(err => console.log(err));
}
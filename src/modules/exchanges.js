import http from './http.js';

export function getAllBestExchanges () {
    return http.get(`/exchanges/best/all`)
    .then(response => response.json())
    .catch(err => console.log(err));
}

export function getExchangesUserBuy () {
    return http.get(`/exchanges/best/buy`)
    .then(response => response.json())
    .catch(err => console.log(err));
}

export function getExchangesUserSell () {
    return http.get(`/exchanges/best/sell`)
    .then(response => response.json())
    .catch(err => console.log(err));
}
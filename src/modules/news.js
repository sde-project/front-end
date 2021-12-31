import config from './config.js';
import http from './http.js';

export function getLatestNews() {
    return http.get(`${config.news_api}/latest`).then(response => {
        if (response.status == 200) {
            return response.json().then(data => {
                return generateNewsItems(data);
            });
        } else {
            return response.json().then(data => {
                console.log("There was an error getting latest news!");
                console.log(data);
                throw new Error(data.error);
            });
        }
    });
}

export function getLatestCryptoNews(crypto) {
    return http.get(`${config.news_api}/latest/crypto/${crypto}`).then(response => {
        if (response.status == 200) {
            return response.json().then(data => {
                return generateNewsItems(data);
            });
        } else {
            return response.json().then(data => {
                console.log("There was an error getting latest news!");
                console.log(data);
                throw new Error(data.error);
            });
        }
    });
}

function generateNewsItems(data) {
    let newsHtml = "";
    data.forEach(news => {
        newsHtml += `
        <a href="${news.content}" class="list-group-item list-group-item-action flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${news.source}</h5>
                <small class="text-muted">${news.publishedAt}</small>
            </div>
            <p class="mb-1">${news.title}</p>
            <small class="text-muted">${news.content}</small>
        </a>
        `;
    });
    return newsHtml;
}

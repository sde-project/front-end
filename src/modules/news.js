import http from './http.js';

export function getLatestNews() {
    return http.get(`/news/latest`).then(response => {
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
    return http.get(`/news/latest/crypto/${crypto}`).then(response => {
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
        let trending = "balance";
        if (news.sentiment > 0) {
            trending = "trending-up";
        } else if (news.sentiment < 0) {
            trending = "trending-down";
        }
        newsHtml += `
        <a href="${news.content}" target="_blank" class="list-group-item list-group-item-action flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1"><img src="/assets/${trending}.png" width="32" height="32" class="me-3">${news.source}</h5>
                <small class="text-muted">${news.publishedAt}</small>
            </div>
            <p class="mb-1">${news.title}</p>
            <small class="text-muted">${news.content}</small>
        </a>
        `;
    });
    return newsHtml;
}

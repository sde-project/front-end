import { getLatestNews } from "../modules/news.js";

getLatestNews().then(res => {
    $('#news-list').html(res);
});
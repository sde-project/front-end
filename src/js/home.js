import http from "../modules/http.js";
import config from "../modules/config.js";
import {logout} from "../modules/login.js";

// http.get(`${config.users_api}/users/me`).then(response => {
//     if (response.status == 200) {
//         response.json().then(data => {
//             $("#main").html(`Hi, ${data.username}.<br><br>Here is your profile:<br>${JSON.stringify(data)}`);
//         });
//     } else {
//         response.json().then(data => {
//             alert(data.message);
//         });
//     }
// }).catch(err => {
//     console.log(err);
// });

$("#logout").click(() => {
    logout();
    window.location.reload();
});
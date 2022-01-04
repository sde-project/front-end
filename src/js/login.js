import { login, showAuthWindow } from "../modules/login.js";
import http from "../modules/http.js";
import config from "../modules/config.js";

$("#loginButton").click(() => {
    const email = $("#email").val();
    const password = $("#password").val();

    login(email, password).then(() => {
        window.location.href = "/index.html";
    }).catch(error => {
        $("#loginError").text(error.message);
    })
});

$("#googleButton").click(async () => {

    const response = await http.get(`/users/google/oauth?redirect_uri=${config.oauth_redirect_uri}`);
    if(response.status != 200) {
        return alert("There was an error getting Oauth URL from backend.");
    }

    const url = (await response.json()).url;

    showAuthWindow({
        path: url,
        callback: function () {
            if(window.localStorage.getItem('loggedIn') == 'true') {
                window.location.href = "/index.html";
            } else {
                alert("There was an error logging in!");
            }
        }
    });
});
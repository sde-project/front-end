import { register, showAuthWindow } from "../modules/login.js";
import http from "../modules/http.js";
import config from "../modules/config.js";

$("#registerButton").click(async () => {

    const spinner = $("#spinner");
    const button = $("#registerButton");
    button.hide();
    spinner.show();

    const email = $("#email").val();
    const password = $("#password").val();
    const password2 = $("#password2").val();
    const username = $("#username").val();

    if(password !== password2) {
        button.show();
        spinner.hide();
        return $("#registerError").text("Passwords do not match.");
    }

    //check if email is available
    let response = await http.get(`/users/email/${email}`);
    if(response.status != 200) {
        button.show();
        spinner.hide();
        return alert("There was an error checking if email is available.");
    }

    if(await response.json() != true) {
        button.show();
        spinner.hide();
        return $("#registerError").text("Email is already taken.");
    }

    //check if username is available
    response = await http.get(`/users/username/${username}`);
    if(response.status != 200) {
        button.show();
        spinner.hide();
        return alert("There was an error checking if username is available.");
    }

    if(await response.json() != true) {
        button.show();
        spinner.hide();
        return $("#registerError").text("Username is already taken.");
    }

    register(email, username, password).then(() => {
        window.location.href = "/html/edit_profile.html";
    }).catch(error => {
        button.show();
        spinner.hide();
        $("#registerError").text(error.message);
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
                window.location.href = "/html/edit_profile.html";
            } else {
                alert("There was an error logging in!");
            }
        }
    });
});
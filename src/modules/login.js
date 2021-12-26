import jwt from './jwt-decode.js';
import config from './config.js';
import http from './http.js';
import { sendFcmToken } from './cloud_messaging.js';

export function isLogged() {
    if (window.localStorage.getItem('loggedIn') == 'false') {
        return false;
    } else {
        try {
            const token = window.localStorage.getItem('token');
            const decoded = jwt(token);

            if (decoded.iat >= Date.now() / 1000) {
                window.localStorage.setItem('loggedIn', 'false');
                window.localStorage.setItem('token', '');
                return false;
            }

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

export function login(email, password) {
    return http.post(`${config.users_api}/users/login`, {
        email: email,
        password: password
    }).then(response => {
        if (response.status == 200) {
            return response.json().then(data => {
                saveLoginToken(data.token);
                return true;
            });
        } else {
            return response.json().then(data => {
                console.log("There was an error logging in!");
                console.log(data);
                throw new Error(data.message);
            });
        }
    });
}

export function saveLoginToken(token) {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('loggedIn', 'true');

    const decoded = jwt(token);
    window.localStorage.setItem('userId', decoded.id);

    if (window.localStorage.getItem('fcmTokenSent') == 'false') {
        sendFcmToken(window.localStorage.getItem('fcmToken')).catch(err => console.log(err));
    }
}

export function register(email, username, password) {
    return http.post(`${config.users_api}/users/register`, {
        email: email,
        username: username,
        password: password
    }).then(response => {
        if (response.status == 200) {
            return response.json().then(data => {
                saveLoginToken(data.token);
                return true;
            });
        } else {
            return response.json().then(data => {
                console.log("There was an error registering!");
                console.log(data);
                throw new Error(data.message);
            });
        }
    });
}

export function logout() {
    window.localStorage.setItem('loggedIn', 'false');
    window.localStorage.setItem('token', '');
    window.localStorage.setItem('userId', '');
    window.localStorage.setItem('fcmToken', '');
    window.localStorage.setItem('fcmTokenSent', 'false');
}

export function showAuthWindow(options) {
    options.windowName = options.windowName || 'ConnectWithOAuth'; // should not include space for IE
    options.windowOptions = options.windowOptions || 'location=0,status=0,width=600,height=800';
    options.callback = options.callback || function () { window.location.reload(); };
    const _oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
    const _oauthInterval = window.setInterval(function () {
        if (_oauthWindow.closed) {
            window.clearInterval(_oauthInterval);
            options.callback();
        }
    }, 1000);
}
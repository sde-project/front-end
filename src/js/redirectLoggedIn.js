import {isLogged} from '../modules/login.js';

if(isLogged()) {
    window.location.href = '/index.html';
}
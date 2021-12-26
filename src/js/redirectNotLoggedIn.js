import {isLogged} from '../modules/login.js';

if(!isLogged()) {
    window.location.href = '/html/login.html';
}
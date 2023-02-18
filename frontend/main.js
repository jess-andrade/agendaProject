import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Login from './modules/Login';
//import './assets/css/style.css';

console.log('OK');

//* I used "Login" to validate form-login and form-register
const login = new Login('.form-login');
const register = new Login('.form-register');

login.init();
register.init();
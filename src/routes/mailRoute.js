const express = require('express');
const { register } = require('../controllers/mailController')
const route = express.Router();

route.get('/login-page', (req, res) => {
    res.render('loginPage');
});
route.get('/register-page', (req, res) => {
    res.render('registerPage');
});
route.get('/forgot-password-page', (req, res) => {
    res.render('forgotPasswordPage');
});

route.post('/sign-in', register)

module.exports = route;
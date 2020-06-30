const express = require('express');
var cookieParser = require('cookie-parser');
const login = require('../models/user');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const router = express.Router();

var parseForm = bodyParser.urlencoded({ extended: false });
//var parseCookies = cookieParser();
var csrfProtection = csrf({cookie: true, signed: true});

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login', { csrfToken: req.csrfToken() });
});

/* POST login credentials */
router.post("/", parseForm, csrfProtection, async function(req, res, next) {

    // TODO: MIDDLEWARE MAY ALREADY CHECK FOR CSRF TOKEN, OR WE MAY NEED TO CHECK FOR CSRF TOKEN

    let user = login.getUserByEmail(req.body.email);

    const tokens = await login.loginUser(req.body.password, user.password, user._id);

    const httpCookies = {
        accessToken: tokens[0],
        refreshToken: tokens[1]
    }


    // send tokens in set-cookie header to the client's storage in response

    res.cookie('access_token', httpCookies.accessToken, { httpOnly: true });

    res.cookie('refresh_token', httpCookies.refreshToken, { httpOnly: true });


    // send csrf token cookie and any other required data in body
    // make sure csrf token is non-http
    res.send('successful login');
});

module.exports = router;
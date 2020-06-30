var express = require('express');
const register = require('../models/user');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const csrf = require('csurf');
var router = express.Router();

var parseForm = bodyParser.urlencoded({ extended: false });
//var parseCookies = cookieParser();
var csrfProtection = csrf({cookie: true, signed: true});

/* GET home page. */
router.get('/', function(req, res, next) {
    let token = req.csrfToken();
    console.log(token);
    res.render('register', { csrfToken: token });
});

/* POST login credentials */
router.post("/", parseForm, csrfProtection, async function(req, res, next) {

    let newUser = {
        email: req.body.email,
        password: req.body.password
    }

    const tokens = await register.registerUser(newUser);

    const httpCookies = {
        accessToken: tokens[0],
        refreshToken: tokens[1]
    }


    // send tokens in set-cookie header to the client's storage in response

    res.cookie('access_token', httpCookies.accessToken, { httpOnly: true });

    res.cookie('refresh_token', httpCookies.refreshToken, { httpOnly: true });

    //res.header("Set-Cookie", httpCookies);

    // send csrf token cookie and any other required data in body
    console.log(res.body);
    res.redirect('/');
    //res.send(tokens[2] + 'hi');

});

module.exports = router;
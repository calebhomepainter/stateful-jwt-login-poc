var express = require('express');
const register = require('../models/user');
var router = express.Router();
const csrf = require('csurf');

var csrfProtection = csrf({cookie: true});

/* GET home page. */
router.get('/', csrfProtection, function(req, res, next) {
    res.render('register', { csrfToken: req.csrfToken() });
});

/* POST login credentials */
router.post("/", csrfProtection, async function(req, res, next) {

    // TODO: MIDDLEWARE MAY ALREADY CHECK FOR CSRF TOKEN, OR WE MAY NEED TO CHECK FOR CSRF TOKEN

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
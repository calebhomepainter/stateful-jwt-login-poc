const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const login = require('../models/user');


var csrfProtection = csrf({cookie: true});
/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

/* POST login credentials */
router.post("/", async function(req, res, next) {

    let user = login.getUserByEmail(req.body.email);

    const tokens = await login.loginUser(req.body.password, user.password, user._id);

    const httpCookies = {
        accessToken: tokens[0],
        refreshToken: tokens[1]
    }


    // send tokens in set-cookie header to the client's storage in response

    res.cookie('access_token', httpCookies.accessToken, { httpOnly: true });

    res.cookie('refresh_token', httpCookies.refreshToken, { httpOnly: true });

    //res.header("Set-Cookie", httpCookies);

    // send csrf token cookie and any other required data in body
    // make sure csrf token is non-http
    res.send(tokens[2]);
});

module.exports = router;
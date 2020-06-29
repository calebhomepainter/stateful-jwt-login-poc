var express = require('express');
const register = require('../models/user');
var router = express.Router();
const csrf = require('csurf');

var csrfProtection = csrf({cookie: true});

/* GET home page. */
router.get('/', csrfProtection, function(req, res, next) {
    res.render('register', { title: 'Express' });
});

/* POST login credentials */
router.post("/", async function(req, res, next) {

    //console.log(req.body);
    let newUser = {
        email: req.body.email,
        password: req.body.password
    }
    const tokens = await register.registerUser(newUser);
    //console.log(tokens);
    //const tokens = await login.loginUser(req.body.password, user.password, user._id);

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
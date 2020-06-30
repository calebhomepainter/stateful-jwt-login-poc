(function () {
    'use strict';

    const csrf = require('csurf');
    const register = require('../models/user');

    module.exports = {
        GenerateCsrfToken: GenerateCsrfToken,
        Register: Register
    };

    async function GenerateCsrfToken(req, res) {
        let token = req.csrfToken();
        console.log('auth controller' + token);
        //res.render('register', { csrfToken: token });

        return token;
    }

    async function Register(req, res) {
        console.log(req.body);
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
        //res.redirect('/');
    }

})();

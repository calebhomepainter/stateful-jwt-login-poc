(function () {
    'use strict';

    const authFunctions = require('../models/user');
    const jwt = require('jsonwebtoken');

    module.exports = {
        GenerateCsrfToken: GenerateCsrfToken,
        Register: Register,
        Profile: Profile,
        Logout: Logout,
        Login: Login
    };

    async function GenerateCsrfToken(req, res) {
        let token = req.csrfToken();
        return res.status(200).send(JSON.stringify({token: token}));
    }

    async function Register(req, res) {
        let newUser = {
            email: req.body.email,
            password: req.body.password
        }

        const tokens = await authFunctions.registerUser(newUser);

        const httpCookies = {
            accessToken: tokens[0],
            refreshToken: tokens[1]
        }

        // send tokens in set-cookie header to the client's storage in response
        res.cookie('access_token', httpCookies.accessToken, { httpOnly: true });
        res.cookie('refresh_token', httpCookies.refreshToken, { httpOnly: true });

        res.status(200).send();
    }

    async function Profile(req,res) {
        console.log('hit profile');
        //res.send();
    }

    async function Logout(req, res) {
        // clear cookies
        console.log('hit logout');
        cookies.set('access_token', {expires: Date.now()});
        cookies.set('refresh_token', {expires: Date.now()});
        cookies.set('_csrf', {expires: Date.now()});
    }

    async function Login(req, res) {
        let user = {
            email: req.body.email,
            password: req.body.password
        }

        const tokens = await authFunctions.loginUser(user);

        const httpCookies = {
            accessToken: tokens[0],
            refreshToken: tokens[1]
        }

        // send tokens in set-cookie header to the client's storage in response
        res.cookie('access_token', httpCookies.accessToken, { httpOnly: true });
        res.cookie('refresh_token', httpCookies.refreshToken, { httpOnly: true });

        res.status(200).send();
    }

})();

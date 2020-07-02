(function () {
    'use strict';

    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const csrf = require('csurf');

    const router = require('express').Router();
    router.use(cookieParser());
    // may need signed
    const csrfProtection = csrf({ cookie: true, httpOnly: false, ignoreMethods: ['GET'] });

    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    const tokenAuth = require('../models/user');
    const tokenMiddleware = async function (req, res, next) {
        if (req.cookies.access_token) {
            let verifyAccess = await tokenAuth.validateJwtAccessToken(req.cookies.access_token.accessToken);
            if (verifyAccess) {
                return res.send({message: 'access token valid & access granted'});
            } else {
                if (req.cookies.refresh_token) {
                    let verifyRefresh = await tokenAuth.validateJwtRefreshToken(req.cookies.refresh_token.refreshToken);
                    if (verifyRefresh) {
                        await tokenAuth.generateJwtAccessToken();
                        return res.send({message: 'access token generated & access granted'});
                    } else {
                        return res.send({message: 'both tokens invalid & access denied'});
                    }
                }
                else{
                    return res.send({message: 'no refresh token access denied'});
                }
            }
        }
        else {
            return res.send({message: 'no access token access denied'});
        }
        next();
    }
    const authController = require('../controllers/authController');

    router.get('/get-csrf-token', csrfProtection, authController.GenerateCsrfToken);

    router.post('/register', csrfProtection, authController.Register);

    router.get('/profile', csrfProtection, tokenMiddleware, authController.Profile);

    router.post('/logout', csrfProtection, tokenMiddleware, authController.Logout);

    router.post('/login', csrfProtection, authController.Login);

    module.exports = router;
})();

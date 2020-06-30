(function () {
    'use strict';

    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const csrf = require('csurf');
    const parseForm = bodyParser.urlencoded({ extended: false });
    // may need to be signed
    const csrfProtection = csrf({cookie: true });


    const router = require('express').Router();

    router.use(bodyParser.json());
    router.use(cookieParser());

    const authController = require('../controllers/authController');

    router.get('/get-csrf-token', authController.GenerateCsrfToken);
    router.post('/register', parseForm, csrfProtection, authController.Register);

    module.exports = router;
})();

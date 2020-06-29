var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const csrf = require('csurf');

var csrfProtection = csrf({cookie: true});

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('profile');
  console.log(req.cookies);
  console.log(jwt.verify(req.cookies));
  console.log('profile');
  res.send('respond with a resource');
});

module.exports = router;

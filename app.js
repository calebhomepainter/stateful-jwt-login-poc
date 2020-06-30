var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const morgan = require('morgan');

const csrf = require('csurf');
//const jwt = require('jsonwebtoken');

const apiRoutes = require('./routes/api');


mongoose.connect('mongodb://localhost/login-poc', () => { console.log("[+] Succesfully connected to database."); });

var app = express();
app.use(morgan('common', {}));
app.use('/api', apiRoutes);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

//app.use(csrf({cookie: true}));
// TODO CSRF token needs to be set as soon as the user visits the site
//app.use(function(req, res, next) {

  // check request body for hidden field
  //if(!req.body.x_csrf_token){
  //  res.X_CSRF_Token = req.csrfToken();
  //}

  //////////////////////////////////

  //if(req.cookies){

  //}

  //let reqBodyToJson = JSON.stringify(req.body);


  // unsure if this cookie should be signed ???
  // make sure csrf token is non-http
  //if(!reqBodyToJson.csrf_token) {
  //  res.body = req.csrfToken();
  //}


//   console.log('start of middleware');
//   console.log(res.body);
//   next();
// });

// TODO ADD MIDDLEWARE FOR EXPIRED TOKEN/TOKEN ACCESS POLICIES/TOKEN VALIDATION

// var validTokens = (req, res, next) => {
//   if(req.cookies.access_token && req.cookies.refresh_token && req.)
//   if () {
//     const decodedPayload = jwt.verify(req.cookies.access_token)
//   }
// }

app.use(function(req, res, next) {
  //const decodedPayload = jwt.verify(req.cookies.access_token)
  console.log(req.cookies);
  console.log(req.body);
  //console.log(jwt.verify(req.cookies));
  console.log('end of middleware');
  next();
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiRoutes = require('./routes/api');

mongoose.connect('mongodb://localhost/login-poc', () => { console.log("[+] Succesfully connected to database."); });

app.use(morgan('common', {}));
app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(3000, ()=>{console.log('listening on 3000')});

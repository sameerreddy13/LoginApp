/* https://scotch.io/tutorials/easy-node-authentication-setup-and-local */
var express = require('express');
var app = express();
var port = 3003;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');

// configure passport file
require('./config/passport')(passport);

//set up express app
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());
app.set('view engine', 'ejs');

// set up passport
app.use(session({secret: 'x', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// load routes and pass in app and passport
require('./app/routes.js')(app, passport);

// start app
app.listen(port);
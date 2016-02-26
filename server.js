pry = require('pryjs');
'use strict'
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var pg = require('pg');
var connectionString = "postgres://Viorel:DB_Pass@localhost/sessions_test";
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var path = require('path');
var methodOverride = require('method-override');

var db = require('./db/pg');
var app = express();

app.use(session({
  store: new pgSession({
    pg : pg,
    conString : connectionString,
    tableName : 'session'
  }),
  secret : 'cia',
  resave : false,
  cookie : { maxAge : 30 * 24 * 60 * 60 * 1000 } // 30 days
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('short'));

app.use(methodOverride('_method'))

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
  res.render('home.html.ejs', { user : req.session.user});
})




var port = process.env.PORT || 3000;
var server = app.listen(port)
// var server = app.listen(process.env.PORT || 3000, function() {
//   console.log(`Listening on port ${process.env.PORT}`);
// });

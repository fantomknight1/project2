
var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');
var path = require('path');
var userIdRoute = require( path.join(__dirname, '/userID'));
users.use('/:userID', userIdRoute);

users.post('/signup', db.createUser, function(req, res){
  res.redirect('/');
});

// users.route('/')
users.get('/signup', function(req, res) {
  res.render('users/new.html.ejs');
});

users.route('/login')
  .get(function(req, res) {
  res.render('users/login.html.ejs');
  })
  .post(db.loginUser, function(req, res) {
  req.session.user = res.rows;

  // when you redirect you must force a save due to asynchronisity
  // https://github.com/expressjs/session/issues/167 **
  // "modern web browsers ignore the body of the response and so start loading
  // the destination page well before we finished sending the response to the client."

  req.session.save(function() {
    res.redirect('/users/userHome' + req.session.user.id);
  });
});

users.route('/userHome:userID')
.get(function(req,res){
  res.render('users/userHome.html.ejs', { user : req.session.user});
});


  // app.get('/', function(req, res) {
  //   res.render('home.html.ejs', { user : req.session.user});
  // });

users.delete('/logout', function(req, res) {
  req.session.destroy(function(err){
    res.redirect('/');
  });
});
















module.exports = users;

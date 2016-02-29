
var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');
var path = require('path');

if (process.env.ENVIRONMENT === 'production'){
  var config =process.env.DATABASE_URL;
} else{
  var config = {
    host: process.env.DB_HOST,
    Port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  };
}
// var userIdRoute = require( path.join(__dirname, '/userID'));
// users.use('/:userID', userIdRoute);

// users.route('/')
users.route('/signup')
  .get(function(req, res) {
    res.render('users/new.html.ejs');
  })
  .post(db.createUser, function(req, res){
    res.redirect('/');
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
    res.redirect(req.session.user.id);
  });
});

// users/:id/profile

users.route('/:id')
  .get(function(req,res){
    res.render('users/userHome.html.ejs', { user : req.session.user});
  });

users.route('/:id/edit')
  .get(db.showProfile, function(req, res) {
    res.render('users/editUser.html.ejs', { user : req.session.user, userEdit: res.profiles[0]});
  })
  .put(db.updateProfile, function(req, res){
    console.log('updated info')
    res.status(303).redirect('/users/'+ req.session.user.id);
    console.log('redirected')
  });

users.route('/:id/profile')
  .get(db.showProfile, function(req,res){
    console.log('getProfile')
    res.render('users/currentUser.html.ejs', { user : req.session.user});
  });

users.route('/:id/profile/')
  .delete(db.deleteUser, function(req, res) {
    res.redirect('/');
  });

users.route('/logout')
  .delete(function(req, res) {
    req.session.destroy(function(err){
      res.redirect('/');
    });
  });















module.exports = users;

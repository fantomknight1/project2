var express = require('express');
var userID = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');

userID.route('/profile')
  .get(db.showProfile, function(req,res){
    res.render('users/currentUSER.html.ejs', { user : req.session.user, posts: res.rows});
  })
  // .post(db.loginUser, function(req, res) {
  //   req.session.user = res.rows;
  //
  //   // when you redirect you must force a save due to asynchronisity
  //   // https://github.com/expressjs/session/issues/167 **
  //   // "modern web browsers ignore the body of the response and so start loading
  //   // the destination page well before we finished sending the response to the client."
  //
  //   req.session.save(function() {
  //     res.redirect('/users/profile/:userID' + req.session.user.id);
  //   });
  // });

userID.get('profile/edit', db.showProfile, function(req, res) {
  res.render('users/edit', {userEdit: res.profiles[0]});
});
userID.delete('/logout', function(req, res) {
  req.session.destroy(function(err){
    res.redirect('/');
  });
});


module.exports = userID;

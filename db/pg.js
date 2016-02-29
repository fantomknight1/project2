var pg = require('pg');
var connectionString = "postgres://Viorel:DB_Pass@localhost/sessions_users";
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var session = require('express-session');


function loginUser(req, res, next) {
    var codename = req.body.codename;
    // var email = req.body.email;
    var password = req.body.password;

    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      var query = client.query("SELECT * FROM users WHERE codename LIKE ($1);", [codename], function(err, results) {
        done();
        if (err) {
          return console.error('error running query', err);
        }

        if (results.rows.length === 0) {
          res.status(204).json({success: true, data: 'no content'});
        } else if (bcrypt.compareSync(password, results.rows[0].password_digest)) {
          res.rows = results.rows[0];
          next();
        }
      });
    });
}

function createSecure(codename, email, password, callback) {
  // hashing the password given by the user at signup
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      // this callback saves the user to our databased
      // with the hashed password

      // saveUser(email, hashed)
      callback(codename, email, hash);
    });
  });
}

// module.exports.getMassage = (req, res, next) => {
//   pg.connect(config, (err, client, done) => {
//     if (err) {
//       done();
//       console.log(err);
//       res.status(500).json({success: false, data: err});
//     }
//
//     client.query('SELECT * FROM massages WHERE id = $1', [req.params.id], (err, results) => {
//       done();
//
//       if (err) {
//         console.error('Error with query', err);
//       }
//
//       res.massages = results.rows;
//       next();
//     });
//   });
//
// };


function createUser(req, res, next) {
  createSecure(req.body.codename, req.body.email, req.body.password, saveUser);
  console.log('createUser');

  function saveUser(codename, email, hash) {
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }

      var query = client.query("INSERT INTO users( codename, email, password_digest) VALUES ($1, $2, $3);", [codename, email, hash], function(err, result) {
        done();
        console.log('saveUser');
        if (err) {
          return console.error('error running query', err);
        }
        next();
      });
    });
  }
}

function showProfile(req, res, next){
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }

    var query = client.query('SELECT * FROM users WHERE id = $1', [req.params.id], function(err, results) {
      done();

      if (err) {
        console.error('Error with query', err);
      }

      res.profiles = results.rows;
      next();
    });
  });
};

module.exports.showProfile = showProfile;
module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
// module.exports.getUser = getUser;

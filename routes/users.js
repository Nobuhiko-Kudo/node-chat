var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var crypto = require("crypto");
var secretKey = "secretKey";
var getHash = function(value) {
    var sha = crypto.createHmac('sha256', 'secretKey');
    sha.update(value);
    return sha.digest('hex');
};

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource!');
});
*/
router.get('/', function (req, res) {
  if(!req.isAuthenticated()) { res.redirect('/login'); }
  res.render('main_room', { user : req.user });
});

router.get('/register', function(req, res, next) {
  res.render('register', {});
})

router.post('/register', function(req, res) {
  User.register(new User({
    name: req.body.name,
    email: req.body.email,
    password: getHash(req.body.password)
  }), req.body.password, function(err, user) {
    console.log("req.body.name", req.body.name);
    console.log("req.body.email", req.body.email);
    console.log("req.body.password", req.body.password);

    if (err) {
      console.log("err", err);
      return res.render("register", {
        errInfo: "Sorry. That username already exists. Try again."
      });
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
});
module.exports = router;

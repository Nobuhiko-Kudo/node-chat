var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/user');

router.post('/', passport.authenticate('local', {
  failureRedirect: "/login?err=unauthorized"
}), function(req, res) {
  res.redirect('/');
});

router.get('/', function(req, res) {
  console.log('login view');
  console.log(req.user);
  res.render('login', {
    user: req.user,
    errInfo: req.query.err
  });
});

module.exports = router;

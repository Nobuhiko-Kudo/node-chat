var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/user');
var redis = require('redis');
var client_redis = redis.createClient();

router.post('/', passport.authenticate('local', {
  failureRedirect: "/login?err=unauthorized"
}), function(req, res) {
  client_redis.sadd("login_users", req.user.name);
  res.redirect('/');
});

router.get('/', function(req, res) {
  console.log('login view' + req.user);
  res.render('login', {
    user: req.user,
    errInfo: req.query.err
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var redis = require('redis');

router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()) { res.redirect('/login'); }
  var client_redis = redis.createClient();
  client_redis.srem('login_users', req.user.name);
  req.logout();
  console.log('logout');
  res.redirect('/login');
});

module.exports = router;

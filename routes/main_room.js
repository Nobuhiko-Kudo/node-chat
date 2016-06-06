var express = require('express');
var router = express.Router();
var redis = require('redis');
/* GET home page. */
router.get('/', function(req, res, next) {
  var client_redis = redis.createClient();
  client_redis.smembers("login_users", function(err, user_names){
    var login_names = user_names;
    if(!req.isAuthenticated()) { res.redirect('/login'); }
    console.log('main_room view');
    res.render('main_room', { title: 'Express', user: req.user, login_users: login_names });
  });
});

module.exports = router;

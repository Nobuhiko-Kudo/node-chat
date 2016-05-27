var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()) { res.redirect('/login'); }
  req.logout();
  console.log('logout');
  res.redirect('/login');
});

module.exports = router;

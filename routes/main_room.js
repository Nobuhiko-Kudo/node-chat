var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()) { res.redirect('/login'); }
  console.log('main_room view');
  res.render('main_room', { title: 'Express', user: req.user });
});

module.exports = router;

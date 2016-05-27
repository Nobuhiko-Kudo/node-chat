var User, Schema, mongo;

mongo = require('mongoose');
var passportLocalMongose = require('passport-local-mongoose');
mongo.connect('mongodb://localhost/cmapp');

Schema = mongo.Schema;

User = new Schema({
  name: String,
  email: String,
  password: String,
  created_at: {
    type: Date,
    "default": Date.now
  },
  updated_at: {
    type: Date,
    "default": Date.now
  }
});

User.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

User.plugin(passportLocalMongose, { usernameField: 'email', usernameQueryFields: ['email'] });
module.exports = mongo.model('User', User);

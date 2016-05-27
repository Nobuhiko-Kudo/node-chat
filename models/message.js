var Message, Schema, mongo;

mongo = require('mongoose');

//mongo.connect('mongodb://localhost/cmapp');

Schema = mongo.Schema;

Message = mongo.model('messages', new Schema({
  username: String,
  text: String,
  created_at: {
    type: Date,
    "default": Date.now
  },
  updated_at: {
    type: Date,
    "default": Date.now
  }
}));

module.exports = Message;

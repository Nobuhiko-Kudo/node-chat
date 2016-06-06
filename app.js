var express = require('express');
var http = require('http');
var path = require('path');
var mongo = require('mongoose');
var redis = require('redis');
var client_redis = redis.createClient();
var io = require('socket.io');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require("connect-flash");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//Hash値を求める。

var crypto = require("crypto");
var secretKey = "secretKey";
var getHash = function(value) {
    var sha = crypto.createHmac('sha256', 'secretKey');
    sha.update(value);
    return sha.digest('hex');
};

//シリアライズの設定
passport.serializeUser(function(user, done){
    done(null, {email: user.email, _id: user._id});
});
passport.deserializeUser(function(serializedUser, done){
    user.findById(serializedUser._id, function(err, user){
        done(err, user);
    });
});


var app = express();
// app.router を使う前にpassportの設定が必要です
app.use(flash());

//暗号化
app.use(require('express-session')({
  secret: 'secret secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//routes
var main_room = require('./routes/main_room');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');

//app.listen(8152);
var server = require('http').createServer(app);
var io = io.listen(server);

//model setup
var message = require('./models/message');
var user = require('./models/user');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', main_room);
app.use('/users', users);
app.use('/login', login);
app.use('/logout', logout);

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  }, function(req, email, password, done){
    process.nextTick(function(){
      user.findOne({ email: email }, function(err, user){
        if (err) { return done(err); }
        if (!user) {
          console.log(email);
          console.log('loginmessage', 'ユーザーIDが間違っています。');
          return done(null, false);
        }
        var hashedPassword = getHash(password);
        if ( user.password !== hashedPassword) {
          console.log(user);
          console.log(password);
          console.log('loginmessage', 'パスワードが間違っています。');
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//再起動時は、ログインユーザーの記録を削除する。
client_redis.del('login_users');
server.listen(5555)
io.sockets.on('connection', function(socket) {

  message.find(function(err, messages) {
    if (err) {
      throw err;
    }
    return socket.emit('messeges:show', {
      messages: messages
    });
  });

  socket.on('message:send', function(data) {
    var msg;
    msg = new message();
    msg.text = data.message;
    msg.username = data.username;
    return msg.save(function(err) {
      if (err) {
        throw err;
      }
      return io.sockets.emit('message:receive', {
        username: data.username,
        message: data.message
      });
    });
  });
});

module.exports = app;

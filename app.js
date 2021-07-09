//jshint esversion:6
require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');

// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
// const bcrypt = require('bcrypt');
// const saltRounds = 2;

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'cat & cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb+srv://OfficerK:BladeRunner2049@cluster0.9nsud.mongodb.net/377', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const user = mongoose.model('user', userSchema);

passport.use(user.createStrategy());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.get('/secrets', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('secrets');
  }
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
});

app.post('/register', function(req, res) {
  const username = req.body.username;
  const pwd = req.body.password;
  user.register({
    username: username
  }, pwd, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect('/register');
    }
    if (!err) {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets');
      });
    }
  });
});

app.post('/login', function(req, res) {
  const uzer = new user({
    username : req.body.username,
    pwd : req.body.password
  });

  req.login(uzer, function(err) {
    if (err) {
      console.log(err);
    }
    if (!err) {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets');
      });
    }
  });
});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.listen(3000, function() {
  console.log("Server Running on PORT 3000");
});

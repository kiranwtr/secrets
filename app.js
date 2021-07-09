//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


const app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://OfficerK:BladeRunner2049@cluster0.9nsud.mongodb.net/377', {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 useFindAndModify: false,
 useCreateIndex: true
});

const userSchema = mongoose.Schema({
  username: String,
  password: String
});

let secret = "notsosecret";
// let secret = "nosecret";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password']  });


const user = mongoose.model('user', userSchema);


app.get('/', function (req, res){
  res.render('home');
});

app.get('/login', function (req, res){
  res.render('login');
});

app.get('/register', function (req, res){
  res.render('register');
});

app.get('/secrets', function (req, res){
  res.render('secrets');
});

app.post('/register', function (req, res){
  const username = req.body.username;
  const pwd = req.body.password;
  const newUser = new user({
    username: username,
    password: pwd
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render('secrets');
    }
  });
});

app.post('/login', function(req, res){
  const username = req.body.username;
  const pwd = req.body.password;
  user.findOne({username: username}, function(err, data){
    if(err){
      console.log(err + "User Not Found");
    }else {
      if(data){
        if(data.password === pwd){
          res.render('secrets');
        }else{
          res.render('login', { error: "Pass erroe"});
        }
      }
    }
  });
});



app.listen(3000, function(){
  console.log("Server Running on PORT 3000");
});

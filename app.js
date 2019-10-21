//jshint esversion:6

require("dotenv").config();
const express = require("express"); //require express
const bodyParser = require("body-parser"); // require bodyParser
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express(); // create app const by using express



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true}); // connecting to mongodb

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){ // render to home page
  res.render("home");
});

app.get("/login", function(req, res){ // render to login page
  res.render("login");
});

app.get("/register", function(req, res){ // render to register page
  res.render("register");
});


app.post("/register", function(req, res){
  const newUser = new User ({
    email: req.body.username, // user username
    password: req.body.password // user Password
  });
  newUser.save(function (err) {
    if(err){
      console.log(err);
    } else {
      res.render("secrets"); // render secrets page only when loged in(registered)
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req. body.password;

  User.findOne({email: username}, function(err, foundUser){ //  username match Email
    if(err){
      console.log(err);
    } else {
      if(foundUser){ // email match
        if (foundUser.password === password){ // email password match password in db
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function() { // listen 3000
  console.log("Server started Succsesfully.");
});

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const md5=require("md5");
const cookieParser = require('cookie-parser');
const request=require('request');

const app = express();
app.use(cookieParser());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/Registration2", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

const UserSchema = new mongoose.Schema({
  username:String,
  name: String,
  email: String,
  password: String,
});



const User = new mongoose.model("User", UserSchema);



app.get("/", function(req, res) {


  res.render("index");
});


app.get("/login",function(req,res){
  res.render("login")
});


app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register", function(req, res) {
  var a = req.body.text;
  var b = req.body.email;
  var d = md5(req.body.password);
  var e = req.body.cpassword;

  //console.log(a + " " + b + " " + c + " " + d + " " + e + " " + f + " " + g);
  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

  User.find({
    'email': b
  }, function(err, users) {
    if (err) {
      console.log(err);
      res.render("failure");
    } else if(isEmpty(users))
    {
      const user = new User({
        name: a,
        email: b,
        password: d,

        username: b

      });
      user.save();
      res.redirect("/login");
    }
    else
    res.render("failure");
  });

});

app.get("/ambulance", function(req,res){
  res.render("home")
});

var name;
var a={};
app.post("/ambulance",function(req,res){
  request("https://places.ls.hereapi.com/places/v1/discover/explore?at=19.1335144659%2C72.9092113631&cat=hospital-health-care-facility&apiKey=19Yzvz9O7CTVq1mf-B2ZzBuKz4Luu7coPP3N-Tdx5iA",function(error,response,body){
    var data=JSON.parse(body);
    name=data.results.items;
    //console.log(name);
    for(var i=0;i<name.length;i=i+1)
    {
      // console.log(name[i]);
      console.log(name[i].title);
      console.log(name[i].position);
      a[i]=(name[i].title);
      //console.log(a[i]);
    }
    //console.log(a);
    res.render("result",{hname: a});

  });
});

app.post("/login", function(req, res) {
  var x = req.body.userName;
  var y = md5(req.body.password);
  console.log(x + " " + y);

  User.find({
    'rollno': x
  }, function(err, users) {
    if (err) {
      res.render("failure");

      console.log(err);
    } else
    {
      console.log(users[0]);
      console.log(users);
      if(y===users[0].password){
        res.cookie("userid", x);
      res.render("profile");
      }
      else
      res.render("failure");
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

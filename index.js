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


app.get("/", function(req, res) {


  res.render("index");
});


app.get("/login",function(req,res){
  res.render("login")
});


app.get("/register",function(req,res){
  res.render("register");
});

app.get("/ambulance", function(req,res){
  res.render("home")
});

var name;
app.post("/ambulance",function(req,res){
  request("https://places.ls.hereapi.com/places/v1/discover/explore?at=19.1335144659%2C72.9092113631&cat=hospital-health-care-facility&apiKey=19Yzvz9O7CTVq1mf-B2ZzBuKz4Luu7coPP3N-Tdx5iA",function(error,response,body){
    var data=JSON.parse(body);
    name=data.results.items;
    for(var i=0;i<name.length;i=i+1)
    {
      console.log(name[i]);
      // console.log(name[i].title);
      // console.log(name[i].position[0]);
    }
    res.render("result");

  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//jshint esversion:6

const express = require("express");

//making a get request to external server with node using native https node module
const https = require("https");
// doesnt need to be installed with node because it's native

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function (req,res){
  res.sendFile(__dirname + "/index.html");

});

app.post ("/", function (req, res) {

  const query = req.body.cityName;
  const apiKey = "c5a35d3b06fdb48173dad05834b52689";
  const unit = "metric";
  //use https module to call the get method
  //remember to include 'https://' at the beginning of the url
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid="+ apiKey +"&units=" + unit;

  https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){ //the method .on lets us tap into 'data'. corresponds to the actual message body thay we were sent
      //data is returned in hexideximal
      const weatherData = JSON.parse(data); //JSON.parse lets you turn it into JSON format

      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;

      const imageURL = "http://openweathermap.org/img/wn/" +icon+"@2x.png";


      res.write("<h1>The temperature in " +query+ " is " + temp + " degrees Celsius.</h1>"); //remember you can use html in res tags
      res.write("<h2>The weather is currently " + description + "</h2>"); //recall: if you want to send multiple things, use res.write first
      res.write("<img src="+imageURL+">");
      res.send();
    });
  });

});



app.listen (3000, function(){
  console.log("server is running on port 3000");
});

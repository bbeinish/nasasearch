const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {images: null, error: null});
})

app.post('/', function (req, res) {
  let search = req.body.search;
  let start_year = req.body.start_year || 2000;
  let end_year = req.body.end_year || 2019;
  let url = `https://images-api.nasa.gov/search?q=${search}&media_type=image&year_start=${start_year}&year_end=${end_year}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {images: null, error: 'Error, please try again. This is a request error'});
    } else {
      console.log(url)
      let images = JSON.parse(body)
      if(images.collection == undefined){
        res.render('index', {images: null, error: 'Error, please try again'});
      } else {
        // let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        images = images.collection.items
        res.render('index', {images: images, error: null});
        //let index = "/views.index.ejs"
        //index.getElementById("images").innerHTML = "<h>hello</h>";
      }
    }
  });
})

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT)
})

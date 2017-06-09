var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  res.send(JSON.stringify({
    "hello": "world"
  }));
});


app.get('/test', function(req, res){
  res.sendFile(path.join(__dirname , '/test.html'));
});

app.get('/hello', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // var userId = req.param.userId;

  res.send(JSON.stringify({
    "hello": "world"
  }));
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Sample app is listening on port ' + port);

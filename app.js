var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var comments = require('./json/comments.json');
var comment = require('./json/comment.json');
var feed = require('./json/feed.json');
var login = require('./json/login.json');
var userReactionPost = require('./json/userReactionPost.json');
var userReactionDelete = require('./json/userReactionDelete.json');

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

app.get('/v1/comments', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // var userId = req.param.userId;

  res.send(JSON.stringify(comments));
});

app.get('/v1/comments/{postId}', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // var userId = req.param.userId;

  res.send(JSON.stringify(comments));
});

app.get('/v1/feed', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  // var userId = req.param.userId;

  res.send(JSON.stringify(feed));
});

app.get('/v1/login/callback', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(login));
});

app.post('/v1/user-reaction', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(userReactionPost));
});

app.post('/v1/comment', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(comment));
});

app.delete('/v1/user-reaction', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(userReactionDelete));
});

app.use(express.static('html'));

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Sample app is listening on port ' + port);

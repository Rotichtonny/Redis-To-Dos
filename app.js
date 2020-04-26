var express = require ('express');
var path = require('path');
var bodyParser = require('body-parser');
var redis = require('redis');

// Create main app variable
var app = express();

// Redis client - connect to redis
var client = redis.createClient();

client.on('connect', function (params) {
    console.log('Connected To Redis...');
});

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.send('HOME');
});

app.listen(3000, function (params) {
    console.log('Server started on port 3000');
});

module.exports = app;
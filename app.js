const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const redis = require('redis');

// Create main app variable
let app = express();

// Redis client - connect to redis
const client = redis.createClient();

client.on('connect', function (params) {
    console.log('Connected To Redis...');
});

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    let title = 'Redis To Dos';

    // Fetch Todos from redis
    client.lrange('todos', 0, -1, function (err, reply) {
        if (err) {
            res.send(err);
        }

        res.render('index', {
            title: title,
            todos: reply
        });
    });
});

app.post('/todo/add', function (req, res, next) {
    let todo = req.body.todo;

    client.rpush('todos', todo, function (err, reply) {
        if (err) {
            res.send(err);
        }

        console.log('Todo Added...');
        res.redirect('/');
    });
});

app.post('/todo/delete', function (req, res, next) {
    let delTodos = req.body.todos;

    client.lrange('todos', 0, -1, function (err, todos) {
        for (let i = 0; i < todos.length; i++) {
            if (delTodos) {
                if (delTodos.indexOf(todos[i]) > -1) {
                    client.lrem('todos', 0, todos[i], function (params) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        }
        res.redirect('/');
    });
});

app.listen(3000, function (params) {
    console.log('Server started on port 3000');
});

module.exports = app;
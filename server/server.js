const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

let app = express();

// apply bodyParser middleware
app.use(bodyParser.json());

// POST /todos
app.post('/todos', (req, res) => {
  // console.log(req.body);
  const todo = new Todo({
    text: req.body.text
  });

  todo.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err); // 400 Bad Request
    });
});

// GET /todos
app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({ todos });
    }, (err) => {
      res.status(400).send(err);
    });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

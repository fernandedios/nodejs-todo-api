require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');
let { authenticate } = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT || 3000;

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

// GET /todos/102293
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send(); // 404 Not Found request status
  }

  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch((err) => {
      res.status(400).send();
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch((err) => res.status(400).send());
});

// PATCH /todos/:id
app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  let body = _.pick(req.body, ['text', 'completed']); // pick only the user updateable fields

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch((err) => {
      res.status(400).send();
    });
});

// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      // send custom http header x-auth
      res.header('x-auth', token).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// POST /users/login { email, password }
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken()
        .then((token) => {
          // send custom http header x-auth
          res.header('x-auth', token).send(user);
        });
    })
    .catch((err) => {
      res.status(400).send();
    });
});

// DELETE /users/me/token
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
});


// start server at port
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };

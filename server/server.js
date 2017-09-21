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
app.post('/todos', authenticate, (req, res) => {
  // console.log(req.body);
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err); // 400 Bad Request
    });
});

// GET /todos
app.get('/todos', authenticate, (req, res) => {
  // get todos of the currently logged in user
  Todo.find({ _creator: req.user._id })
    .then((todos) => {
      res.send({ todos });
    }, (err) => {
      res.status(400).send(err);
    });
});

// GET /todos/102293
app.get('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send(); // 404 Not Found request status
  }

  Todo.findOne({ _id: id, _creator: req.user._id })
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
// async await
app.delete('/todos/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({ _id: id, _creator: req.user._id });
    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  }
  catch (err) {
    res.status(400).send();
  }

  // promise chaining version
  // Todo.findOneAndRemove({ _id: id, _creator: req.user._id })
  //   .then((todo) => {
  //     if (!todo) {
  //       return res.status(404).send();
  //     }
  //
  //     res.send({ todo });
  //   })
  //   .catch((err) => res.status(400).send());
});

// PATCH /todos/:id
app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate(
    { _id: id, _creator: req.user._id },
    { $set: body },
    { new: true }
  )
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
// async await
app.post('/users', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }
  catch (err) {
    res.status(400).send(err);
  }

  // promise chaining version
  // user.save()
  //   .then(() => {
  //     return user.generateAuthToken();
  //   })
  //   .then((token) => {
  //     // send custom http header x-auth
  //     res.header('x-auth', token).send(user);
  //   })
  //   .catch((err) => {
  //     res.status(400).send(err);
  //   });
});

// POST /users/login { email, password }
// async await
app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }
  catch (err) {
    res.status(400).send();
  }

  // promise chaining version
  // User.findByCredentials(body.email, body.password)
  //   .then((user) => {
  //     return user.generateAuthToken()
  //       .then((token) => {
  //         // send custom http header x-auth
  //         res.header('x-auth', token).send(user);
  //       });
  //   })
  //   .catch((err) => {
  //     res.status(400).send();
  //   });
});

// DELETE /users/me/token
// async await
app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  }
  catch (err) {
    res.status(400).send();
  }
});


// start server at port
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };

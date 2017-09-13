const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    email: 'fernan@example.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  },

  // user two
  {
    _id: userTwoId,
    email: 'elsa@example.com',
    password: 'userTwoPass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  }
];

const todos = [
  {
    _id: new ObjectID() ,
    text: 'First test todo',
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333 ,
    _creator: userTwoId
  }
];

const populateTodos = (done) => {
  Todo.remove({}) // wipe todos collection!
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
}

const populateUsers = (done) => {
  User.remove({}) // wipe users collection!
    .then(() => {
      let userOne = new User(users[0]).save();
      let userTwo = new User(users[1]).save();

      // consolidate promises using Promise.all(), then return it
      return Promise.all([userOne, userTwo])
    })
    .then(() => done());
}

module.exports = { todos, populateTodos, users, populateUsers };

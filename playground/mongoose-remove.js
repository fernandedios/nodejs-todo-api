const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// remove()
// Todo.remove({})
//   .then((result) => {
//     console.log(result);
//   });

// findOneAndRemove
Todo.findOneAndRemove({ _id: '59a4feb06d84d6a2437944fc' })
  .then((todo) => {
    console.log(todo);
  });

// findByIdAndRemove
// Todo.findByIdAndRemove('59a4feb06d84d6a2437944fc')
//   .then((todo) => {
//     console.log(todo);
//   });

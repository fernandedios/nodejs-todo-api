const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

let userID = '59a3914ac2922b048da6ca33';
// let id = '59a4d75497d63e0af3af65d511';
//
// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// find(), returns an array
// Todo.find({
//     _id: id // works
//   })
//   .then((todos) => {
//     console.log('Todos', todos);
//   });
//
// findOne(), returns an object, or null
// Todo.findOne({
//     _id: id // works
//   })
//   .then((todo) => {
//     console.log('Todo', todo);
//   });

// findById(), returns an object, or null
// Todo.findById(id)
//   .then((todo) => {
//     if (!todo) {
//       return console.log('Id not found');
//     }
//     console.log('Todo by Id', todo);
//   })
//   .catch((err) => console.log(err));

User.findById(userID)
  .then((user) => {
    if (!user) {
      return console.log('User not found');
    }

    console.log('User by Id', user);
  })
  .catch((err) => console.log(err));

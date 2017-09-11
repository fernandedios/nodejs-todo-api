let mongoose = require('mongoose');

// set mongoose model
let Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true // remove trailing spaces
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },

  // _ means signifies that it is an _id / ObjectID
  // _id of user who created the todo
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

// let newTodo = new Todo({
//   text: 'Cook dinner'
// });
//
// newTodo.save()
//   .then((doc) => {
//     console.log('Saved todo: ', doc);
//   }, (err) => {
//     console.log('Unable to save todo', err);
//   });

module.exports = { Todo };

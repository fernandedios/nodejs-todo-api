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

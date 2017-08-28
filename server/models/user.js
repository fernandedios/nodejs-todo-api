let mongoose = require('mongoose');

let User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

// let newUser = new User({
//   email: 'fdd@email.com'
// });
//
// newUser.save()
//   .then((doc) => {
//     console.log('New user saved: ', doc);
//   }, (err) => {
//     console.log('Unable to save user', err);
//   });

module.exports = { User };

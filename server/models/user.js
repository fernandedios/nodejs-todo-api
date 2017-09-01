const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: { type: String, required: true },
    token: { type: String, required: true }
  }]
});

// Override method toJSON
// DO NOT USE fat arrow function, we need to bind this
UserSchema.methods.toJSON = function() {
  let user = this;

  // convert mongoose variable to regular object
  let userObject = user.toObject();

  // do not return secured items like password and tokens
  return _.pick(userObject, ['_id', 'email']); 
};

// DO NOT USE fat arrow function, we need to bind this
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

  user.tokens.push({ access, token });

  // return this so we can tap on another .then, with token as returned object on server.js
  return user.save().then(() => {
      return token;
    });
};

let User = mongoose.model('User', UserSchema);

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

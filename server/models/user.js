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
  let user = this; // lowercase user since this is an instance method

  // convert mongoose variable to regular object
  let userObject = user.toObject();

  // do not return secured items like password and tokens
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

  user.tokens.push({ access, token });

  // return as promise so we can tap another .then, with token as returned object on server.js
  return user.save().then(() => {
      return token;
    });
};

// custom model method
UserSchema.statics.findByToken = function(token) {
  let User = this; // uppercase User since this is a model method
  let decoded;

  // use try / catch because jwt throws an error if token is invalid
  try {
    decoded = jwt.verify(token, 'abc123');
  }
  catch(err) {
    // return new promise with reject flag
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  // return as promise so we can tap another .then, with token as returned object on server.js
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
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

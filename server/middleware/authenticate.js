const { User } = require('./../models/user');

// define authenticate middleware
const authenticate = (req, res, next) => {
  let token = req.header('x-auth'); // fetch custom header

  // use custom model method findByToken
  User.findByToken(token)
    .then((user) => {
      if (!user) {
        // reject promise, will be caught by the catch block
        return Promise.reject();
      }

      req.user = user;
      req.token = token;
      next(); // continue code execution
    })
    .catch((err) => {
      res.status(401).send(); // 401 Unauthorized
    });
};

module.exports = { authenticate };

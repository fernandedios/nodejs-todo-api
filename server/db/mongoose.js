let mongoose = require('mongoose'); // DO NOT USE const

mongoose.Promise = global.Promise; // configure mongoose to use promises
mongoose.connect('mongodb://heroku:heroku@ds163613.mlab.com:63613/todo-api-heroku');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };

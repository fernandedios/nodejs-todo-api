let mongoose = require('mongoose'); // DO NOT USE const

mongoose.Promise = global.Promise; // configure mongoose to use promises
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };

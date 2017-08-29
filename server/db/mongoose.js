let mongoose = require('mongoose'); // DO NOT USE const

mongoose.Promise = global.Promise; // configure mongoose to use promises
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

// workaround! base prod or dev by PORT env var, since mlab was configured outside heroku
const mongo_uri = process.env.PORT !== undefined ? 'mongodb://heroku:heroku@ds163613.mlab.com:63613/todo-api-heroku' : 'mongodb://localhost:27017/TodoApp';
mongoose.connect(mongo_uri);

module.exports = { mongoose };

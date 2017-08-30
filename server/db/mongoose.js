let mongoose = require('mongoose'); // DO NOT USE const

mongoose.Promise = global.Promise; // configure mongoose to use promises
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDb server');
  }

  console.log('Connected to MongoDb server');

  // find() fetches all cursors

  // db.collection('Todos').find({  // fetch todos cursor
  //   _id: new ObjectID('599d0d524c673705f4cab17a') // _id is NOT a string
  //  })
  //   .toArray()                  // get docs, return as array, is a promise
  //   .then((docs) => {           // chain a callback
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs, undefined, 2));
  //   }, (err) => {
  //     console.log('Unable to fetch todos', err);
  //   });

  // db.collection('Todos').find()
  //   .count()
  //   .then((count) => {
  //     console.log(`Todos count: ${count}`);
  //   }, (err) => {
  //     console.log('Unable to fetch todos', err);
  //   });

  db.collection('Users').find({ name: 'Fernan' })
    .toArray()
    .then((docs) => {
      console.log('Users:');
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log('Unable to fetch users', err);
    });

  // db.close();
});

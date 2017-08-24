// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

const obj = new ObjectID();
console.log(obj); //object id similar to mongodb _id

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDb server');
  }

  console.log('Connected to MongoDb server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Fernan',
  //   age: 39,
  //   location: 'Pasig'
  // }, (err, results) => {
  //   if (err) {
  //     return console.log('Unable to insert user', err);
  //   }
  //
  //   // console.log(JSON.stringify(results.ops, undefined, 2));
  //   // console.log(results.ops[0]._id);
  //   console.log(results.ops[0]._id.getTimestamp());
  // });

  db.close();
});

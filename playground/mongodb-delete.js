const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDb server');
  }

  console.log('Connected to MongoDb server');

  // deleteMany
  // db.collection('Todos').deleteMany({ text: 'Eat Lunch' })
  //   .then((result) => {
  //     console.log(result);
  //   });

  // db.collection('Users').deleteMany({ name: 'Fernan' })
  //   .then((result) => {
  //     console.log(result);
  //   });

  // deleteOne
  // db.collection('Todos').deleteOne({ text: 'Eat Lunch' })
  //   .then((result) => {
  //     console.log(result);
  //   });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({ completed: false })
  //   .then((result) => {
  //     console.log(result);
  //   });

  // db.collection('Users').findOneAndDelete({ name: 'Elsa' })
  //   .then((result) => {
  //     console.log(result);
  //   }, (err) => {
  //     console.log(err);
  //   });

  db.collection('Users').findOneAndDelete({ _id: new ObjectID('59a0dca69a15d4d35714dc9c')})
    .then((result) => {
      console.log(JSON.stringify(result));
    });


  // db.close();
});

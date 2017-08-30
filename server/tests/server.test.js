const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
  { text: 'First test todo', _id: new ObjectID() },
  { text: 'Second test todo', _id: new ObjectID(), completed: true, completedAt: 333 }
];

// testing lifecycle method that runs before any test case
beforeEach((done) => {
  Todo.remove({}) // wipe todos collection!
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch((err) => done(err));
      });
  });

  it('should not create todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({ text: '' })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch((err) => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) // toHexString() convert ObjectID to String
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return a 404', (done) => {
    const hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    const hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId) // check if todo has been deleted/does not exist anymore
          .then((todo) => {
            expect(todo).toNotExist();
            done();
          })
          .catch((err) => done(err));
      });
  });

  it('should return a 404 if todo not found', (done) => {
    const hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update todo', (done) => {
    const hexId = todos[0]._id.toHexString();
    const text = 'Test todo text';
    const completed = true;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text, completed })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(completed);
        expect(res.body.todo.completedAt).toBeA('number');
        expect(res.body.todo.text).toBe(text);
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    const hexId = todos[1]._id.toHexString();;
    const text = 'Test todo text2';
    const completed = false;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ text, completed })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(completed);
        expect(res.body.todo.completedAt).toNotExist();
        expect(res.body.todo.text).toBe(text);
      })
      .end(done);
  });
});

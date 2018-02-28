nodejs-todo-api
=========

> Express API refresher

Yet another express todo API

Getting Started
------------

Checkout this repo, install dependencies, configure, then start the app.

```bash
$ git clone git@github.com:fernandedios/nodejs-todo-api.git
$ cd nodejs-todo-api
$ npm install

-- configure app

$ npm start
```

Configuration
------------

This web application requires the following as starting point:
- Local or Online hosted MongoDB

### Local Development Variables
```js
{
  "test": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://your_mongodb_for_tests",
    "JWT_SECRET": "your_jwt_secret_for_tests"
  },
  "development": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://your_mongodb_for_development",
    "JWT_SECRET": "your_jwt_secret_for_development"
  }
}
```

Save as 'config.json' and place it inside the server/config folder.

### Production Environment Variables
You will need to add the following environment variables to your production host

```js
MONGODB_URI,
JWT_SECRET
```

Testing Suite
------------
Basic testing is implemented via Mocha

```bash
$ npm test
```


Thanks
------

nodejs-todo-api* © 2017, Fernan de Dios. Released under the [MIT License].<br>

> [fernandedios.com](http://fernandedios.com) &nbsp;&middot;&nbsp;
> GitHub [@fernandedios](https://github.com/fernandedios) &nbsp;&middot;&nbsp;
> Twitter [@fernan_de_dios](https://twitter.com/fernan_de_dios)

[MIT License]: http://mit-license.org/

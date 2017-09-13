let env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  const config = require('./config.json'); // json automatically converted to object
  const envConfig = config[env];

  Object.keys(envConfig) // gets object keys and returns it as an array
    .forEach((key) => {
      process.env[key] = envConfig[key];
    });
}

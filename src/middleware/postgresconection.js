const conf = require('../config.json');
const Pool = require('pg').Pool
const connection = new Pool({
  user: conf.user,
  host: conf.host,
  database: conf.db,
  password: conf.password,
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
})
connection
  .connect()
  .then(() => console.log('connected'))
  .catch(err => console.error('connection error', err.stack))

module.exports = connection;


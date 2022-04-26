
/*
var Promise = require('bluebird');
var pgp = require('pg-promise');
const conf = require('../config.json');


const camelizeColumns = (data) => {
  const template = data[0];

  for (let prop in template) {
    const camel = pgp.utils.camelize(prop);

    if (!(camel in template)) {
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  }
};

const postgres = pgp({
  promiseLib: Promise,
  receive: (data, result, e) => { camelizeColumns(data); }
});

const connection = postgres(conf.DbUri)

*/
//connection
//  .connect()
//  .then(() => console.log('connected'))
//  .catch(err => console.error('connection error', err.stack))

//module.exports = connection;



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
/*
const conf = require('../config.json');
const Pool = require('pg').Pool
const pool = new Pool({
  user: conf.user,
  host: conf.host,
  database: conf.db,
  password: conf.password,
  port: 5432,
})
pool.connect();

pool.query('SELECT * FROM usuario', (err, results) => {
  if (err) {
    throw err
  }
  response.status(200).json(results.rows)
})
*/


/*
const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM usuario WHERE id = $1', [1], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
*/
//console.log(pool);
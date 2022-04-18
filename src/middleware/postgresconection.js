const cli = require('nodemon/lib/cli');
const { Client } = require('pg');

const connectionData = {
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
  }
  const client = new Client(connectionData)
  module.exports = client;
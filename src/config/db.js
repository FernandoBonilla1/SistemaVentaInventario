const { Pool } = require('pg');
const credentials = require('./credencialdb.json')

const connection = new Pool({
    host: credentials.host,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database,
    port: credentials.port,
    ssl: {
        rejectUnauthorized: false
    } 
});

connection.connect((error) =>{
    if(error){
      console.log('El error de conexion es: ' + error);
      return;
    }
    console.log('¡Conectado a la base de datos!');
  });

module.exports = connection;
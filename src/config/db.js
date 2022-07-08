const { Pool } = require('pg');
const credentials = require('./credencialdb.json')

const connection = new Pool({ //Datos para conecta la base de datos
    host: credentials.host,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database,
    port: credentials.port,
    ssl: {
        rejectUnauthorized: false
    } 
});

connection.connect((error) =>{  //Se verifica la conexion a la base de datos
    if(error){
      console.log('El error de conexion es: ' + error);
      return;
    }
    console.log('¡Conectado a la base de datos!');
  });

module.exports = connection;
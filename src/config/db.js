const { Pool } = require('pg');

const connection = new Pool({
    host:'ec2-44-194-92-192.compute-1.amazonaws.com',
    user:'fzewwbjbvpagaj',
    password:'68d1a048003be2a32c87564442d231273ecff11bd4997ea77550865d66d5fdf1',
    database:'d9mjm093q92o7f',
    port: '5432',
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
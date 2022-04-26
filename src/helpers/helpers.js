
const connection = require('../middleware/postgresconection');

connection.query("SELECT * from usuario", (err, res) => {
  console.log(err, res);
  connection.end();
});


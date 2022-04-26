const path = require('path');
const express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
//import Api_Routes from './routes/api';
//import AuthRoutes from './routes/auth';
const config = require('./config.json');


//console.log(config);
const app = express(); //Iniciar el servidor con express.
app.set('view engine', 'ejs'); //Esta linea permite al servidor reconocer las vistas en formato ejs.
app.set('views', path.join(__dirname, 'views')); //Esto permite definir la carpeta donde se deben buscar las vistas.
app.use( express.static('public') );
//app.use(`/${config.RouteServer}`, express.static(path.join(__dirname, 'public')));//Se define la carpeta con los archivos estaticos.
app.use(methodOverride());
app.use(bodyParser.urlencoded({extended: false})); //Estas ultimas 2 lineas de codigo nos permiten que entre las vistas puedan enviarle datos al servidor con formato json y no acepte otros tipos de archivos.


var port = process.env.port || 3000; // Si el sistema esta en produccion se le asigna el puerto dado por el servidor


app.get('/', function (req, res) {
  res.render('index');
});


app.get('*', function (req, res) {
    res.render('404');
});

app.listen(port, () =>{
  console.log(`El servidor esta escuchando en http://localhost:${port}`)
});

//module.exports = app;
/*










app.listen(port, () => {
    console.log(`La app esta corriendo en http://localhost:${port}`)
});

*/
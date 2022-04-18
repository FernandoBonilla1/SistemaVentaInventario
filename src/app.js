const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');
var port = process.env.port || 3000;


//Contenido estatico
app.use( express.static('public') );
//handlebars
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', function (req, res) {
  res.render('index');
});


app.get('*', function (req, res) {
    res.render('404');
});

app.listen(port, () => {
    console.log(`La app esta corriendo en http://localhost:${port}`)
});

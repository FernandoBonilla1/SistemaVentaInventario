const express = require("express");
const authCtrl = require("./routes/authroutes");
const Router= require("./routes/routes");

const app = express();

//middlewares
app.use(express.json()); //Cuando llegue un json se puede manipularlo y transformarlo a js
app.use(express.urlencoded({extended: false})); //Cuando llegue un formulario se puede manipular y convertirlo en un objeto

//routes
app.use(Router);
app.use(authCtrl);



app.listen(3000);
console.log('Server on port 3000');

const express = require("express");
var cookieParser = require('cookie-parser');
var cors = require("cors");
const fileUpload = require("express-fileupload");

const authCtrl = require("./routes/authroutes");
const Router= require("./routes/routes");
const app = express();

const corsOptions = {credentials:true, origin: process.env.URL || '*'};
app.use(cookieParser());
app.use(cors(corsOptions));
require('dotenv').config();
app.use(express.json({limit: '5mb'})); //Cuando llegue un json se puede manipularlo y transformarlo a js
app.use(express.urlencoded({extended: false, limit: '5mb'})); //Cuando llegue un formulario se puede manipular y convertirlo en un objeto

//para subir archivos
app.use(fileUpload());

//contenido estatico
app.use('/static', express.static('public'));

//routes
app.use('/api/',Router);
app.use(authCtrl);


const port = process.env.PORT || 3000;
app.listen(port, ()=>{  
    console.log(`El servidor esta escuchando en el puerto ${port}`);
});


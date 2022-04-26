const connection = require('./postgresconection');
var jwt = require('jsonwebtoken');

const authFunction = {};

const generateToken = (rut) => { //Genera un token desde la libreria jwt, recibiendo el RUT
    return jwt.sign({
        rut

        },
        secretToken,{
            expiresIn: '2h'
        }
    )
}

module.exports = authFunction;


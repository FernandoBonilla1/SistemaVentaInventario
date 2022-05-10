const connection = require('../config/db');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var jwthelpers = require("../helpers/jwt.helpers");

const register = async (req, res) =>{

}

const login = async (req, res) =>{
    try{
        const{rut, password} = req.body;
        const users = await connection.query('SELECT * FROM usuario WHERE rut = $1', [rut]);
        if(users.rows.length === 0){ //Detecta si el rut ingresado es correcto
            return res.status(401).json({
                msg: "El rut no existe"
            });
        }
        //Verificar password
        const validPassword = await bcrypt.compare(password, users.rows[0].clave);
        if(!validPassword){
            return res.status(401).json({
                msg: "Contraseña incorrecta"
            })
        }
        //return res.status(200).json({msg: "Ingreso exitoso"})
        //JWT
        let tokens = jwthelpers.jwtTokens(users.rows[0]);
        res.cookie('refresh_token',tokens.refreshToken,{httpOnly:true});
        res.json(tokens);
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}


module.exports = {
    register,
    login
}
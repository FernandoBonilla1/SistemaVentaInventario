const connection = require('../config/db');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var jwthelpers = require("../helpers/jwt.helpers");

const register = async (req, res) =>{
    try {
        const { rut, name, surname, password, email, address, phone, city } = req.body;
        const banned = false;
        const hashedPassword = await bcrypt.hash(password, 10);
        //Se ingresa el usuario a la base de datos
        const newUser = await connection.query(`INSERT INTO users(rut,name,surname,password,email,address,phone,city,banned) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
         [rut,name,surname,hashedPassword,email,address,phone,city,banned]);
        res.json({
            msg: `Se logro ingresar el usuario con rut: ${rut}`
        });
    } catch (error){
        res.status(500).json({
            msg: "No se pudo ingresar el usuario",
            error
        })
    }
}

const login = async (req, res) =>{
    try{
        const{rut, password} = req.body;
        const users = await connection.query('SELECT * FROM users WHERE rut = $1', [rut]);
        //Detecta si el rut ingresado es correcto
        if(users.rows.length === 0){ 
            return res.status(401).json({
                msg: "El rut no existe"
            });
        }
        //Verificar password
        const validPassword = await bcrypt.compare(password, users.rows[0].password);
        if(!validPassword){
            return res.status(401).json({
                msg: "Contraseña incorrecta"
            })
        }
        //Verificar si el usuario esta expulsado
        if(users.rows[0].banned){
            return res.status(401).json({
                msg: "El usuario esta expulsado de la plataforma"
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
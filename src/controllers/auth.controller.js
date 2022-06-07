const connection = require('../config/db');
//const bcrypt = require('bcrypt');
const bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
var jwthelpers = require("../helpers/jwt.helpers");



const logout = async (req, res) => {
    res.clearCookie('refresh_token');
    res.status(200).json({
        msg: "Se cerro la sesión."
    })
}

const register = async (req, res) => {
    try {
        const { rut, name, surname, password, email, address, phone, city } = req.body;
        if (rut == undefined || name == undefined || surname == undefined || password == undefined || email == undefined) {
            return res.status(400).json({
                msg: "Debe incluir todos los campos obligatorios"
            })
        } else {
            if (rut == "" || name == "" || surname == "" || password == "" || email == "") {
                return res.status(400).json({
                    msg: "Debe rellenar todos los campos obligatorios"
                })
            } else {
                const banned = false;
                const hashedPassword = await bcryptjs.hash(password, 10);
                //const hashedPassword = await bcrypt.hash(password, 10);
                //Se ingresa el usuario a la base de datos
                const newUser = await connection.query(`INSERT INTO users(rut,name,surname,password,email,address,phone,city,banned) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,[rut, name, surname, hashedPassword, email, address, phone, city, banned]);
                const newClient = await connection.query("INSERT INTO client(rut) VALUES($1)",[rut])
                res.status(200).json({
                    msg: `Se logro crear el cliente con rut: ${rut}`
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo ingresar el usuario",
            error
        })
    }
}

const login = async (req, res) => {
    try {
        const { rut, password } = req.body;
        const users = await connection.query('SELECT * FROM users WHERE rut = $1', [rut]);
        //Detecta si el rut ingresado es correcto
        if (users.rows.length === 0) {
            return res.status(401).json({
                msg: "El rut no existe"
            });
        }
        //Verificar password
        const validPassword = await bcryptjs.compare(password, users.rows[0].password);
        //const validPassword = await bcrypt.compare(password, users.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({
                msg: "Contraseña incorrecta"
            })
        }
        //Verificar si el usuario esta expulsado
        if (users.rows[0].banned) {
            return res.status(401).json({
                msg: "El usuario esta expulsado de la plataforma"
            })
        }
        //return res.status(200).json({msg: "Ingreso exitoso"})
        //JWT

        //let tokens = jwthelpers.jwtTokens(users.rows[0]);
        //res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
        res.status(200).json({
            rut: users.rows[0].rut,
            name: users.rows[0].name,
            surname: users.rows[0].surname,
            email: users.rows[0].email,
            address: users.rows[0].address,
            phone: users.rows[0].phone,
            city: users.rows[0].city,
            msg: "Sesion iniciada correctamente."
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}


module.exports = {
    register,
    login,
    logout
}
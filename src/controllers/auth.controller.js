const connection = require('../config/db');
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
                const users = await connection.query('SELECT * FROM users WHERE rut = $1', [rut]);
                const banned = false;
                const hashedPassword = await bcryptjs.hash(password, 10);
                //Detecta si el rut ingresado es correcto
                if (users.rows.length === 0) {
                    const newUser = await connection.query(`INSERT INTO users(rut,name,surname,password,email,address,phone,city,banned,Role) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [rut, name, surname, hashedPassword, email, address, phone, city, banned, 1]);
                    const newClient = await connection.query("INSERT INTO client(rut) VALUES($1)", [rut])
                    res.status(200).json({
                        msg: `Se logro crear el cliente con rut: ${rut}`
                    });
                } else {
                    res.status(400).json({
                        msg: "No se puede registrar cliente con un rut existente"
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo ingresar el usuario",
            error
        })
    }
}

const registerFuncionario = async (req, res) => {
    try {
        const { rut, name, surname, password, email, address, phone, city, Role } = req.body;
        if (rut == undefined || name == undefined || surname == undefined || password == undefined || email == undefined) {
            return res.status(400).json({
                msg: "Debe incluir todos los campos obligatorios"
            })
        } else {
            if (rut == "" || name == "" || surname == "" || password == "" || email == "" || Role == 1) {
                return res.status(400).json({
                    msg: "Debe rellenar todos los campos obligatorios"
                })
            } else {
                const users = await connection.query('SELECT * FROM users WHERE rut = $1', [rut]);
                const banned = false;
                const hashedPassword = await bcryptjs.hash(password, 10);
                if (users.rows.length === 0) {
                    const newUser = await connection.query(`INSERT INTO users(rut,name,surname,password,email,address,phone,city,banned,role) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [rut, name, surname, hashedPassword, email, address, phone, city, banned, Role]);
                    res.status(200).json({
                        msg: `Se logro crear el nuevo funcionario con rut: ${rut}`
                    });
                } else {
                    const newUser = await connection.query(`UPDATE users SET name = $1, surname = $2, password = $3, email = $4, address = $5, phone = $6, city = $7, banned = $8, role = $9 Where rut = $10`,[name, surname, hashedPassword, email, address, phone, city, banned, Role, rut])
                    res.status(200).json({
                        msg: "Se actualizaron los datos del funcionario"
                    });
                }
            }
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { rut, password } = req.body;
        const users = await connection.query('SELECT * FROM users WHERE rut = $1', [rut]);
        //Detecta si el rut ingresado es correcto
        if (users.rows.length === 0) {
            return res.status(400).json({
                msg: "El rut no existe"
            });
        }
        //Verificar password
        const validPassword = await bcryptjs.compare(password, users.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Contraseña incorrecta"
            })
        }
        //Verificar si el usuario esta expulsado
        if (users.rows[0].banned) {
            return res.status(400).json({
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
            role: users.rows[0].role,
            status: 200
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

const loginFuncionario = async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
        //Detecta si el rut ingresado es correcto
        if (users.rows.length === 0) {
            return res.status(400).json({
                msg: "El email no existe"
            });
        }
        //Verificar password
        const validPassword = await bcryptjs.compare(password, users.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Contraseña incorrecta"
            })
        }
        //VERIFICA EL ROL
        if ((users.rows[0].role != 1)) {
            res.status(200).json({
                rut: users.rows[0].rut,
                name: users.rows[0].name,
                surname: users.rows[0].surname,
                email: users.rows[0].email,
                address: users.rows[0].address,
                phone: users.rows[0].phone,
                city: users.rows[0].city,
                role: users.rows[0].role,
                status: 200
            });
        } else {
            return res.status(400).json({
                msg: "Un cliente un puede acceder por este portal."
            })
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

module.exports = {
    register,
    login,
    logout,
    loginFuncionario,
    registerFuncionario
}
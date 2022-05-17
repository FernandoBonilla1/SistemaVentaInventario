
const connection = require('../config/db');
const bcrypt = require('bcrypt');


const getUsers = async (req, res) =>{
    try{
        const users = await connection.query('SELECT * FROM users');
        res.json({users: users.rows});
    } catch (error){
        res.status(500).json({
            msg: "No se puedieron acceder a la lista de usuarios",
            error
        })
    }
    
}

const createUsers = async (req, res) =>{
    try {
        const { rut, name, surname, password, email, address, phone, city } = req.body;
        const banned = false;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await connection.query(`INSERT INTO users(rut,name,surname,password,email,address,phone,city,banned) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
         [rut,name,surname,hashedPassword,email,address,phone,city,banned]);
        res.status(200).json({
            msg: `Se logro ingresar el usuario con rut: ${rut}`
        });
    } catch (error){
        res.status(500).json({
            msg: "No se pudo ingresar el usuario",
            error
        })
    }
}

const getUserById = async (req, res) =>{
    try{
        const {rut} = req.body;
        const users = await connection.query('SELECT * FROM users WHERE rut = $1',[rut]);
        res.status(200).json({users: users.rows});
    } catch (error){
        res.status(500).json({
            msg: "No se pudo obtener al usuario",
            error
        })
    }
    
};

const deleteUser = async (req, res) =>{
    try{
        const {rut} = req.body;
        const users = await connection.query('DELETE FROM users WHERE rut = $1', [rut]);
        res.status(200).json({
            msg: `Se elimino el usuario con rut: ${rut}`
        })
    } catch (error){
        res.status(401).json({
            msg: "No se pudo eliminar el usuario"
        });
    }
};

const updateUser = async (req, res) =>{
    try{
        const {rut, banned} = req.body;
        const users = await connection.query('UPDATE users SET banned = $1 WHERE rut = $2', [banned, rut]);
        res.status(200).json({
            msg: `Se modifico el estado del usuario: ${rut}`
        })
    } catch (error){
        res.status(401).json({
            msg: "No se pudo modificar el estado del usuario"
        });
    }
}

module.exports = {
    getUsers,
    createUsers,
    getUserById,
    deleteUser,
    updateUser
}
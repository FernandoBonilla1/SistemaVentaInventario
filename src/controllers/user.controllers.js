
const connection = require('../config/db');
const bcrypt = require('bcrypt');


const getUsers = async (req, res) =>{
    try{
        const users = await connection.query('SELECT * FROM usuario');
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
        const { rut, name, surname, password, address, phone, city } = req.body;
        const banned = false;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await connection.query(`INSERT INTO usuario(rut,nombre,apellido,clave,direccion,telefono,eliminado,ciudad) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
         [rut,name,surname,hashedPassword,address,phone,banned,city]);
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

const getUserById = async (req, res) =>{
    const rut = req.params.rut;
    const response = await connection.query(`SELECT * FROM usuario WHERE rut = $1`, [rut],(error, results) =>{
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

const deleteUser = async (req, res) =>{
    const rut = req.params.rut;
    connection.query("DELETE FROM usuario WHERE rut =$1", [rut], (error, results) =>{
        if(error){
            throw error;
        }
        response.status(200).send(`El usuario fue eliminado`)
    });
};

const updateUser = async (req, res) =>{

}

module.exports = {
    getUsers,
    createUsers,
    getUserById,
    deleteUser,
    updateUser
}
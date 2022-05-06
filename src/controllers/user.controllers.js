
const connection = require('../middleware/postgresconnection');
const crypto = require('crypto');
const { response } = require('express');

const algorithm = "aes-256-cbc"; 
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

const getUsers = async (req, res) =>{
    connection.query('SELECT * FROM usuario',(error, results) =>{
        if(error){
            throw error;
        }
        res.status(200).json(results.rows);
    });
    
}

const createUsers = async (req, res) =>{
    
    const { rut, name, surname, password, address, phone, city } = req.body;
    const banned = false;
    console.log(rut,name,surname,password,address,phone,city);
    
    let encryptedData = cipher.update(password, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    connection.query(`INSERT INTO usuario(rut,nombre,apellido,clave,direccion,telefono,eliminado,ciudad) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`, [rut,name,surname,encryptedData,address,phone,banned,city], (error, results) =>{
        if (error){
            throw error
        }
        res.status(201).json({
            mesagge: "El usuario fue creado"
        });
    });
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
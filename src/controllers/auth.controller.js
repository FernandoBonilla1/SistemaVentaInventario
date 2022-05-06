const connection = require('../middleware/postgresconnection');
const crypto = require('crypto');

const algorithm = "aes-256-cbc"; 
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

/*
const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

decryptedData += decipher.final("utf8");

console.log("Decrypted message: " + decryptedData);
*/


const register = async (req, res) => {
    console.log(req.body);
    const rut = req.body.rut;
    const name = req.body.name;
    const surname = req.body.surname;
    const password = req.body.password;
    const address = req.body.address;
    const phone = req.body.phone;
    const city = req.body.city;

    if(!rut, !name, !surname, !password, !address, !phone, !city){ //verifica si se rellenaron los campos.
        res.status(400).json({
            message: "Por favor rellene todos los campos"
        });
        return;
    }
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

const login = async (req, res) => { 
    console.log(req.body);
    const rut = req.body.rut;
    const password = req.body.password;
    if((!rut) ||(!password)){ //verifica si se rellenaron los campos.
        res.status(400).json({
            message: "Por favor proporcione el usuario y la contraseña."
        });
    }
    
    connection.query(`SELECT * FROM usuario WHERE rut = $1`, [rut], (error, results) => {
        if(error){
            throw error
        }          
        res.status(200).json(results.rows)
    })   
}



module.exports = {
    register,
    login
}
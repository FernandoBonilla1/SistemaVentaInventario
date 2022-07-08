const connection = require('../config/db');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const functions = require('../helpers/functionshelper')
const credentials = require("../credencialesgmail.json")
const authFunctions = {}

//Conexion y credenciales para enviar correos
var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // Nombre del host
    secureConnection: false,  //Permite una conexion poca segura
    port: 587, 
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: credentials.email, //Email
        pass: credentials.password //Contraseña
    }
});


authFunctions.register = async (req, res) => { //Registrar cliente
    try {
        const { rut, name, surname, password, email, address, phone, city } = req.body;
        if (rut == "" || name == "" || surname == "" || password == "" || email == "") {
            return res.status(400).json({
                msg: "Debe rellenar todos los campos obligatorios"
            })
        } else {
            let get_user_id = 'SELECT * FROM users WHERE rut = $1'
            const users = await connection.query( get_user_id, [rut]); //Busca un cliente por rut
            const banned = false;
            const hashedPassword = await bcryptjs.hash(password, 10);
            //Detecta si el rut ingresado es correcto
            if (users.rows.length === 0) {
                let insert_client = `INSERT INTO users(rut,name,surname,password,email,address,phone,city,banned,Role) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`
                const newUser = await connection.query(insert_client, [rut, name, surname, hashedPassword, email, address, phone, city, banned, 1]); //Se inserta un nuevo cliente
                res.status(200).json({
                    msg: `Se logro crear el cliente con rut: ${rut}`
                });
            } else {
                res.status(400).json({
                    msg: "No se puede registrar cliente con un rut existente"
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

authFunctions.registerFuncionario = async (req, res) => { //Registro funcionario
    try {
        const { rut, name, surname, email, address, phone, city, Role } = req.body;
        if (rut == undefined || name == undefined || surname == undefined || email == undefined) {
            return res.status(400).json({
                msg: "Debe incluir todos los campos obligatorios"
            })
        } else {
            if (rut == "" || name == "" || surname == "" || email == "" || Role == 1) {
                return res.status(400).json({
                    msg: "Debe rellenar todos los campos obligatorios"
                })
            } else {
                let get_user_id = 'SELECT * FROM users WHERE rut = $1'
                const users = await connection.query( get_user_id, [rut]); //Se busca usuario por rut
                const banned = false;
                if (users.rows.length === 0) {
                    const randomstring = functions.generateRandomString(15).trim(); //Se crea un string random
                    const hashedPassword = await bcryptjs.hash(randomstring, 10);
                    let insert_user = `INSERT INTO users(rut,name,surname,password,email,address,phone,city,banned,role) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`
                    const newUser = await connection.query( insert_user, [rut, name, surname, hashedPassword, email, address, phone, city, banned, Role]); //Se registra el nuevo funcionario
                    let get_user = "select * from users where rut = $1"
                    const newEmployee = await connection.query( get_user,[rut]) //Se busca el funcionario por su rut recien ingresado
                    
                    var mailOptions = { //Se ingresan los datos para enviar correo
                        from: credentials.email,  //Correo del remitente
                        to: newEmployee.rows[0].email, //Correo empleado
                        subject: 'Cuenta creada para nuevo empleado', 
                        text: '', 
                        html: functions.getCreateNewEmployee(randomstring)
                    };
        
                    transporter.sendMail(mailOptions, function (error, info) { //Se envia el correo
                        if (error) {
                            return res.status(500).json({error:error})
                        }
                        return res.status(200).json({
                            msg: "Se agrego el nuevo empleado y se envio el correo con su contraseña",
                            info: info.message
                        })
                    });
                    
                } else {
                    let update_user = `UPDATE users SET name = $1, surname = $2, email = $3, address = $4, phone = $5, city = $6, banned = $7, role = $8 Where rut = $9`
                    const newUser = await connection.query(update_user, [name, surname, email, address, phone, city, banned, Role, rut]) //Se actualiza el usuario a funcionario
                    return res.status(200).json({
                        msg: "Se actualizaron los datos del funcionario"
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ 
            msg: "No se pudo registrar le nuevo empleado",
            error: error.message 
        });
    }
}

authFunctions.login = async (req, res) => { //Login usuario
    try {
        const { rut, password } = req.body;
        let get_user_id = 'SELECT * FROM users WHERE rut = $1'
        const users = await connection.query( get_user_id, [rut]); //Se busca usuario por rut
        //Detecta si el rut ingresado es correcto
        if (users.rows.length === 0) {
            return res.status(400).json({
                msg: "El rut no existe"
            });
        }
        //Verificar password
        const validPassword = await bcryptjs.compare(password, users.rows[0].password); //Se verifica si la contraseña es correcta
        if (!validPassword) {
            return res.status(400).json({
                msg: "Contraseña incorrecta"
            })
        }
        //Verificar si el usuario esta expulsado
        if (users.rows[0].banned) {   //Se verifica si el usuario fue removido
            return res.status(400).json({
                msg: "El usuario esta expulsado de la plataforma"
            })
        }
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

authFunctions.loginFuncionario = async (req, res) => { //Login funcionario
    try {
        const { email, password } = req.body;
        let get_user_email = 'SELECT * FROM users WHERE email = $1'
        const users = await connection.query( get_user_email, [email]); //Se busca el usuario por email
        //Detecta si el rut ingresado es correcto
        if (users.rows.length === 0) {
            return res.status(400).json({
                msg: "El email no existe"
            });
        }
        //Verificar password
        const validPassword = await bcryptjs.compare(password, users.rows[0].password); //Se verifica la contraseña
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
                msg: "Un cliente no puede acceder por este portal."
            })
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

authFunctions.forgotPassword = async (req, res) => { //Recuperar contraseña
    try {
        const { email } = req.body
        let get_user_email = "Select * from users where email = $1"
        const user = await connection.query( get_user_email, [email]); //se busca el usuario por email
        if (user.rows.length === 0) {
            return res.status(400).json({
                msg: "No hay usuario registrado con este correo"
            })
        } else {
            
            const randomstring = functions.generateRandomString(15).trim(); //Se crea un string aleatorio
            const hashedPassword = await bcryptjs.hash(randomstring, 10);
            let update_user = "Update users set password = $1 where email = $2"
            const userupdate = connection.query(update_user,[hashedPassword,email]) //Se actualiza la contraseña del usuario  por el string aleatorio

            var mailOptions = {
                from: credentials.email, //correo remitente
                to: user.rows[0].email,  //correo usuario
                subject: 'Restablecer contraseña', 
                text: '', 
                html: functions.getHtmlForgotPassword(randomstring)
            };

            transporter.sendMail(mailOptions, function (error, info) { // enviar correo
                if (error) {
                    return res.status(500).json({error:error})
                }
                return res.status(200).json({
                    msg: "Se envio el correo",
                    info: info.message
                })
            });
        }
    } catch (error) {
        res.status(401).json({ 
            msg: "No se pudo enviar cambiar la contraseña del usuario y enviar el correo"
         });
    }
}

authFunctions.resetPassword = async (req, res) => { //Cambiar contraseña
    try{
        const { rut, password, newpassword } = req.body
        let get_user_id = 'SELECT * FROM users WHERE rut = $1'
        const users = await connection.query( get_user_id, [rut]); //Se busca el usuario por rut
        if(users.rows.length === 0){
            res.status(400).json({
                msg: "El usuario no existe"
            })
        } else {
            const validPassword = await bcryptjs.compare(password, users.rows[0].password); //Se verifica la contraseña
            if(!validPassword){
                res.status(400).json({
                    msg: "La contraseña ingresada no es valida"
                })
            }else{
                const hashedPassword = await bcryptjs.hash(newpassword, 10); //Se encripta la nueva contraseña
                let user_update = "Update users set password = $1 where rut = $2"
                const users1 = await connection.query( user_update,[hashedPassword,rut]); //Se actualiza a la nueva contraseña
                res.status(200).json({
                    msg: "Se logro establecer una nueva contraseña"
                })
            }
        }
    }catch(error){
        res.status(500).json({ 
            msg: "No se pudo cambiar la contraseña",
            error: error
         });
    }
    
}

module.exports = authFunctions
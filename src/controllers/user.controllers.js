const connection = require('../config/db');
const bcryptjs = require('bcryptjs');

const userFunction = {};

userFunction.getUsers = async (req, res) => {
    try {
        let get_users = 'SELECT users.rut, users.name, users.surname, users.email, users.address, users.phone, users.city, users.banned, users.role, users.confirmcart from users'
        const users = await connection.query(get_users);
        if (users.rows.length === 0) {
            return res.status(400).json({
                msg: "No hay usuarios"
            })
        }
        res.json(users.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se puedieron acceder a la lista de usuarios",
            error
        })
    }

}

userFunction.updateUser = async (req, res) => {
    try {
        const { rut, banned } = req.body;
        let get_user_rut = "Select * from users where rut = $1"
        const users1 = await connection.query(get_user_rut, [rut]);
        if (users1.rows.length === 0) {
            return res.status(400).json({
                msg: "El usuario no existe"
            })
        } else {
            let update_state_user = 'UPDATE users SET banned = $1 WHERE rut = $2'
            const users2 = await connection.query(update_state_user, [banned, rut]);
            res.status(200).json({
                msg: `Se modifico el estado del usuario: ${rut}`
            })
        }
    } catch (error) {
        res.status(401).json({
            msg: "No se pudo modificar el estado del usuario"
        });
    }
}

userFunction.searchUser = async (req, res) => {
    try {
        const { rut } = req.body;
        let get_user_rut = `SELECT users.rut, users.name, users.surname, users.email, users.address, users.phone, users.city, users.banned, users.role, users.confirmcart from users WHERE rut = $1 `
        const users = await connection.query(get_user_rut, [rut]);
        if (users.rows.length === 0) {
            return res.status(200).json({
                msg: "El rut no coincide."
            });
        }
        res.status(200).json(users.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla usuario",
            error
        })
    }
}

userFunction.modifyUser = async (req, res) => {
    try {
        const { rut, name, surname, email, address, phone, city } = req.body
        if (name == "" || surname == "" || email == "" || address == "" || phone == "" || city == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            });
        } else {
            let get_user_rut = "Select * from users where rut = $1"
            const users1 = await connection.query(get_user_rut, [rut]);
            if (users1.rows.length === 0) {
                return res.status(200).json({
                    msg: "El usuario no existe"
                });
            } else {
                let update_user = "UPDATE users SET name = $1, surname = $2, email = $3, address = $4, phone = $5, city = $6 WHERE rut = $7"
                const users2 = await connection.query( update_user, [name, surname, email, address, phone, city, rut]);
                res.status(200).json({
                    msg: `Se ha actualizo el usuario`
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla usuario",
            error
        })
    }
}

userFunction.modifyRole = async(req, res) => {
    try{
        const {rut, role} = req.body
        let get_user = "Select * from users where rut = $1"
        const users1 = await connection.query(get_user, [rut]);
        if (users1.rows.length === 0) {
            return res.status(400).json({
                msg: "El usuario no existe"
            })
        } else {
            let update_role_user = 'UPDATE users SET role = $1 WHERE rut = $2'
            const users2 = await connection.query( update_role_user, [role, rut]);
            res.status(200).json({
                msg: `Se modifico el rol del usuario con rut: ${rut}`
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla usuario",
            error
        })
    }
}


module.exports = userFunction
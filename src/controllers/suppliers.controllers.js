const connection = require('../config/db');
const capitalizar = require("./products.controller")
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await connection.query('SELECT * FROM supplier');
        res.json(suppliers.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se puedieron acceder a la tabla de proveedores",
            error
        })
    }

}

const createSupplier = async (req, res) => {
    try {
        const { name, description, phone, address, email } = req.body;
        const removed = false;
        if (name == "" || description == "" || address == "" || email == "") {
            res.status(400).json({
                msg: `Debe completar los campos necesarios`
            });
        } else {
            const verify = await connection.query("Select * from supplier where email = $1", [email])
            if (verify.rows.length === 0) {
                const supplier = await connection.query('INSERT INTO supplier(name,description,phone,address,email,removed) VALUES($1,$2,$3,$4,$5,$6)', [name, description, phone, address, email, removed])
                res.status(200).json({
                    msg: `Se logro crear el proveedor: ${name}`
                });
            } else {
                res.status(200).json({
                    msg: "El proveedor ya existe"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se acceder a la tabla de proveedores",
            error
        })
    }
}

const searchSupplier = async (req, res) => {
    try {
        const { name } = req.body;
        if (name == "") {
            return res.status(400).json({
                msg: "Debe escribir el nombre del proveedor"
            });
        } else {
            nameCapitalize = capitalizar.capitalizarPrimeraLetra(name)
            const suppliers = await connection.query(`SELECT * FROM supplier where name LIKE '${nameCapitalize}%'`);
            if (suppliers.rows.length === 0) {
                return res.status(401).json({
                    msg: "No hay proveedores"
                });
            }
            res.status(200).json(suppliers.rows);
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla proveedor",
            error
        })
    }

}

const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.body;
        if (id == "") {
            return res.status(400).json({
                msg: "Debe especificar el id del proveedor"
            })
        } else {
            const product1 = await connection.query("Select * from supplier where id = $1", [id])
            if (product1.rows.length === 0) {
                return res.status(200).json({
                    msg: "No existe el proveedor"
                });
            } else {
                const product2 = await connection.query('DELETE FROM supplier WHERE id = $1', [id]);
                res.status(200).json({
                    msg: `Se elimino el proveedor con id: ${id}`
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla supplier",
            error
        });
    }
}

const modifysupplier = async (req, res) => {
    try {
        const { id, name, description, phone, address, email } = req.body;
        if (id == "" || name == "" || phone == "" || address == "" || email == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            });
        } else {
            const supplier1 = await connection.query("Select * from supplier where id = $1", [id])
            if (supplier1.rows.length === 0) {
                return res.status(200).json({
                    msg: "El proveedor no existe"
                });
            } else {
                const supplier2 = await connection.query('UPDATE supplier SET name = $1, description = $2, phone = $3, address = $4, email = $5 WHERE id = $6', [name, description, phone, address, email,id])
                res.status(200).json({
                    msg: `Se ha actualizo el proveedor`
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla supplier",
            error
        })
    }
}


const changeStatusSupplier = async (req, res) => {
    try {
        const { id, removed } = req.body;
        if(id == ""){
            return res.status(400).json({
                msg: "Debe especificar el id del proveedor para removerlo"
            })
        } else {
            const supplier = await connection.query("Select * from supplier where id = $1",[id]);
            if(supplier.rows.length === 0){
                return res.status(200).json({
                    msg: "El proveedor no existe"
                });
            } else {
                const supplier1 = await connection.query('UPDATE supplier SET removed = $1 WHERE id = $2', [removed, id])
                res.status(200).json({
                    msg: `Se actualizo el estado del proveedor con id: ${id}`
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla supplier",
            error
        })
    }
}


module.exports = {
    getSuppliers,
    createSupplier,
    searchSupplier,
    deleteSupplier,
    modifysupplier,
    changeStatusSupplier
}
const connection = require('../config/db');
const functions = require('../helpers/functionshelper')
const supplierFunctions = {}

supplierFunctions.getSuppliers = async (req, res) => {
    try {
        let get_supplier = 'SELECT * FROM supplier'
        const suppliers = await connection.query(get_supplier);
        res.json(suppliers.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se puedieron acceder a la tabla de proveedores",
            error
        })
    }

}

supplierFunctions.createSupplier = async (req, res) => {
    try {
        const { name, description, phone, address, email } = req.body;
        const removed = false;
        if (name == "" || description == "" || address == "" || email == "") {
            res.status(400).json({
                msg: `Debe completar los campos necesarios`
            });
        } else {
            let get_supplier_email = "Select * from supplier where email = $1"
            const verify = await connection.query( get_supplier_email, [email])
            if (verify.rows.length === 0) {
                let insert_supplier = 'INSERT INTO supplier(name,description,phone,address,email,removed) VALUES($1,$2,$3,$4,$5,$6)'
                const supplier = await connection.query( insert_supplier, [name, description, phone, address, email, removed])
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

supplierFunctions.searchSupplier = async (req, res) => {
    try {
        const { name } = req.body;
        if (name == "") {
            return res.status(400).json({
                msg: "Debe escribir el nombre del proveedor"
            });
        } else {
            nameCapitalize = functions.capitalizarPrimeraLetra(name)
            let search_supplier = `SELECT * FROM supplier where name LIKE '${nameCapitalize}%'`
            const suppliers = await connection.query(search_supplier);
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

supplierFunctions.deleteSupplier = async (req, res) => {
    try {
        const { id } = req.body;
        if (id == "") {
            return res.status(400).json({
                msg: "Debe especificar el id del proveedor"
            })
        } else {
            let get_supplier = "Select * from supplier where id = $1"
            const product1 = await connection.query( get_supplier, [id])
            if (product1.rows.length === 0) {
                return res.status(200).json({
                    msg: "No existe el proveedor"
                });
            } else {
                let delete_supplier = 'DELETE FROM supplier WHERE id = $1'
                const product2 = await connection.query( delete_supplier, [id]);
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

supplierFunctions.modifysupplier = async (req, res) => {
    try {
        const { id, name, description, phone, address, email } = req.body;
        if (id == "" || name == "" || phone == "" || address == "" || email == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            });
        } else {
            let get_supplier = "Select * from supplier where id = $1"
            const supplier1 = await connection.query( get_supplier, [id])
            if (supplier1.rows.length === 0) {
                return res.status(200).json({
                    msg: "El proveedor no existe"
                });
            } else {
                let update_supplier = 'UPDATE supplier SET name = $1, description = $2, phone = $3, address = $4, email = $5 WHERE id = $6' 
                const supplier2 = await connection.query( update_supplier, [name, description, phone, address, email,id])
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


supplierFunctions.changeStatusSupplier = async (req, res) => {
    try {
        const { id, removed } = req.body;
        if(id == ""){
            return res.status(400).json({
                msg: "Debe especificar el id del proveedor para removerlo"
            })
        } else {
            let get_supplier_id = "Select * from supplier where id = $1"
            const supplier = await connection.query( get_supplier_id,[id]);
            if(supplier.rows.length === 0){
                return res.status(200).json({
                    msg: "El proveedor no existe"
                });
            } else {
                let update_supplier = 'UPDATE supplier SET removed = $1 WHERE id = $2'
                const supplier1 = await connection.query( update_supplier, [removed, id])
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


module.exports = supplierFunctions
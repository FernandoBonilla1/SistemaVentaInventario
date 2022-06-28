const connection = require('../config/db');

const getSuppliers = async (req, res) =>{
    try{
        const suppliers = await connection.query('SELECT * FROM supplier');
        res.json(suppliers.rows);
    } catch (error){
        res.status(500).json({
            msg: "No se puedieron acceder a la tabla de proveedores",
            error
        })
    }
    
}

const createSupplier = async (req, res) =>{ 
    try{
        const {name,description,phone,address,email} = req.body;
        const removed = false;
        //const count_id = await connection.query("SELECT COUNT(*) FROM supplier")
        //const {count} = count_id.rows[0]
        //const id = Number(count) + 1
        const supplier = await connection.query('INSERT INTO supplier(name,description,phone,address,email,removed) VALUES($1,$2,$3,$4,$5,$6)',[name,description,phone,address,email,removed])
        res.status(200).json({
            msg: `Se logro crear el proveedor: ${name}`
        });
        //console.log(id);
    } catch (error){
        res.status(500).json({
            msg: "No se acceder a la tabla de proveedores",
            error
        })
    }
}

module.exports = {
    getSuppliers,
    createSupplier
}
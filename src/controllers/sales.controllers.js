const connection = require('../config/db');

const getSale = async (req, res) =>{
    try{
        const sales = await connection.query('SELECT * FROM sale');
        res.json({sales: sales.rows});
    } catch (error){
        res.status(500).json({
            msg: "No se puedieron acceder a la tabla de ventas",
            error
        })
    }   
}

module.exports = {
    getSale
}
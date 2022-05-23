const connection = require('../config/db');

const getDefectiveProduct = async (req, res) =>{
    try{
        const defective_products = await connection.query('SELECT * FROM defective_product');
        res.status(200).json({defective_products: defective_products.rows});
    } catch (error){
        res.status(500).json({
            msg: "No se pudo acceder a la tabla de productos defectuosos",
            error
        })
    }
    
}

const createDefectiveProduct = async (req, res) =>{
    try{
        const {id_sale,id_product,description,date} = req.body;
        const count_id = await connection.query("SELECT COUNT(*) FROM defective_product")
        const {count} = count_id.rows[0]
        const id = Number(count) + 1
        const defective_products = await connection.query('INSERT INTO product(id,id_sale,id_product,description,date) VALUES($1,$2,$3,$4,$5)',[id,id_sale,id_product,description,date]) 
        res.status(200).json({
            msg: `Se logro crear el producto defectuoso con id: ${id}`
        });
    } catch (error){
        res.status(500).json({
            msg: "No se pudo acceder a la tabla de productos defectuosos",
            error
        })
    }
    
}

module.exports = {
    getDefectiveProduct,
    createDefectiveProduct
}
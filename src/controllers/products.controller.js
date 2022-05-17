const { INTEGER } = require('sequelize');
const connection = require('../config/db');

const getProducts = async (req, res) =>{
    try{
        const products = await connection.query('SELECT * FROM product');
        res.status(200).json({products: products.rows});
    } catch (error){
        res.status(500).json({
            msg: "No se pudo acceder a la lista de productos",
            error
        })
    }
    
}

const searchProduct = async (req, res) =>{ 
    try{
        const {name} = req.body;
        const products = await connection.query(`SELECT * FROM product WHERE name LIKE '${name}%'`);
        res.status(200).json({products: products.rows});
    } catch (error){
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
    
}

const createProduct = async (req, res) =>{ 
    try{
        const {year,mark,description,amount,value,id_subcategory,name,id_supplier,stockmin} = req.body;
        const removed = false;
        const count_id = await connection.query("SELECT COUNT(*) FROM product")
        const {count} = count_id.rows[0]
        const id = Number(count) + 1
        const product = await connection.query('INSERT INTO product(id,year,mark,description,amount,value,id_subcategory,name,id_supplier,stockmin,removed) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[id,year,mark,description,amount,value,id_subcategory,name,id_supplier,stockmin,removed])
        res.status(200).json({
            msg: `Se logro crear el producto con id: ${id}`
        });
        //console.log(id);
    } catch (error){
        res.status(500).json({
            msg: "No se pudo agregar el producto a la tabla",
            error
        })
    }
}

const changeStock = async (req, res) =>{ 
    try{
        const {id,amount} = req.body;
        const product = await connection.query('UPDATE product SET amount = $1 WHERE id = $2',[amount, id])
        res.status(200).json({
            msg: `Se actualizo la cantidad al producto con id: ${id}`
        });
        //console.log(id);
    } catch (error){
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}

const changeStatus = async (req, res) =>{ 
    try{
        const {id,removed} = req.body;
        const product = await connection.query('UPDATE product SET removed = $1 WHERE id = $2',[removed, id])
        res.status(200).json({
            msg: `Se actualizo el estado del producto con id: ${id}`
        });
        //console.log(id);
    } catch (error){
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}


module.exports= {
    getProducts,
    searchProduct,
    createProduct,
    changeStock,
    changeStatus
}
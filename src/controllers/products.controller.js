const { INTEGER } = require('sequelize');
const connection = require('../config/db');

const getCategory = async (req, res) =>{
    try{
        const category = await connection.query('SELECT * FROM category');
        res.status(200).json({categorys: category.rows});
    } catch (error){
        res.status(500).json({
            msg: "No se pudo acceder a la tabla category",
            error
        })
    }
}

const getSubCategory = async (req, res) =>{
    try{
        const subcategory = await connection.query('SELECT * FROM subcategory');
        res.status(200).json({subcategorys: subcategory.rows});
    } catch (error){
        res.status(500).json({
            msg: "No se pudo acceder a la tabla subcategory",
            error
        })
    }
}

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

const getProductwithcategorys = async (req, res) =>{
    try{
        const products = await connection.query('SELECT * FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category)')
        res.status(200).json({products: products.rows});
    } catch (error){
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
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

const modifyProduct = async (req, res) =>{ 
    try{
        const {id,year,mark,description,amount,value,name,stockmin} = req.body;
        const product = await connection.query('UPDATE product SET year = $1, mark = $2, description = $3, amount = $4, value = $5, name = $6, stockmin = $7 WHERE id = $8',[year,mark,description,amount,value,name,stockmin,id])
        res.status(200).json({
            msg: `Se ha actualizo el producto`
        });
        //console.log(id);
    } catch (error){
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}

const deleteProduct = async (req, res) =>{
    try{
        const {id} = req.body;
        const users = await connection.query('DELETE FROM product WHERE id = $1', [id]);
        res.status(200).json({
            msg: `Se elimino el producto con id: ${id}`
        })
    } catch (error){
        res.status(401).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        });
    }
};



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
    changeStatus,
    modifyProduct,
    deleteProduct,
    getCategory,
    getSubCategory,
    getProductwithcategorys
}
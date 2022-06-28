const connection = require('../config/db');

const getWantedCart = async (req, res) => {
    try {
        const {rut} = req.body;
        const wantedcart = await connection.query('select wantedcart.id, wantedcart.id_product, product.name as name, product.id_subcategory as subcategory, subcategory.id_category as category, wantedcart.amount, product.url as url from wantedcart inner join product on (wantedcart.id_product = product.id) inner join subcategory on (product.id_subcategory = subcategory.id) inner join category on (subcategory.id_category = category.id) Where wantedcart.rut_user = $1', [rut]);
        if (wantedcart.rows.length === 0) {
            res.status(200).json({
                msg: "No hay productos en tu lista de deseados"
            })
        }
        res.status(200).json({ want: wantedcart.rows });
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla wantedcart",
            error
        })
    }
}

const addProductWantedCart = async (req, res) => {
    try {
        const { rut, id_product, amount } = req.body;
        if (amount < 0) {
            return res.status(400).json({
                msg: "No puede ingresar valores negativos."
            })
        } else {
            const product = await connection.query('INSERT INTO wantedcart(rut_user, id_product, amount) VALUES($1,$2,$3)', [rut, id_product, amount])
            res.status(200).json({
                msg: `Se logro crear el producto con id: ${id_product}`
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla wantedcart",
            error
        })
    }
}

const ModifyWantedCart = async (req, res) => {
    try {
        const { rut, id_product, amount } = req.body;
        if (amount < 0) {
            return res.status(400).json({
                msg: "No puede ingresar valores negativos."
            })
        } else {
            const product = await connection.query('UPDATE wantedcart SET amount = $1 WHERE rut_user = $2 and id_product = $3', [amount, rut, id_product])
            res.status(200).json({
                msg: `Se actualizo la cantidad del producto`
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla wantedcart",
            error
        })
    }
}

const deleteProductWantedCart = async (req, res) => {
    try{
        const {rut, id_product} = req.body;
        if (rut == "" || id_product == "") {
            return res.status(400).json({
                msg: "Debe especificar el producto"
            })
        } else {
            const product = await connection.query('DELETE FROM wantedcart WHERE rut_user = $1 and id_product = $2', [rut,id_product]);
            res.status(200).json({
                msg: `Se elimino el producto de la lista de deseados.`
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla wantedcart",
            error
        })
    }
}

module.exports = {
    getWantedCart,
    addProductWantedCart,
    ModifyWantedCart,
    deleteProductWantedCart
}
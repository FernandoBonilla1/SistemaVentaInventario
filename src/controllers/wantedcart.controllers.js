const connection = require('../config/db');

const getWantedCart = async (req, res) => {
    try {
        const { rut } = req.body;
        const user = await connection.query('select * from users where users.rut = $1', [rut])
        if (user.rows.length === 0) {
            return res.status(200).json({
                msg: "El usuario no existe"
            })
        }
        const wantedcart = await connection.query('select wantedcart.id, wantedcart.id_product, product.name as name, product.id_subcategory as subcategory, subcategory.id_category as category, wantedcart.amount, product.url as url, product.value as price from wantedcart inner join product on (wantedcart.id_product = product.id) inner join subcategory on (product.id_subcategory = subcategory.id) inner join category on (subcategory.id_category = category.id) Where wantedcart.rut_user = $1', [rut]);
        if (wantedcart.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay productos en tu lista de deseados"
            })
        }
        res.status(200).json(wantedcart.rows);
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
            const product1 = await connection.query("Select * from product where product.id = $1", [id_product])
            if (product1.rows.length === 0) {
                return res.status(200).json({
                    msg: "No existe el producto"
                })
            }
            const product2 = await connection.query('select * from wantedcart inner join product on (wantedcart.id_product = product.id) where wantedcart.id_product = $1 and wantedcart.rut_user = $2', [id_product, rut])
            if (product2.rows.length === 0) {
                const product3 = await connection.query('INSERT INTO wantedcart(rut_user, id_product, amount) VALUES($1,$2,$3)', [rut, id_product, amount])
                return res.status(200).json({
                    msg: `Se logro agregar el producto al carrito id: ${id_product}`
                });
            } else {
                return res.status(200).json({
                    code: 1
                })
            }

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
    try {
        const { rut, id_product } = req.body;
        if (id_product == "") {
            return res.status(400).json({
                msg: "Debe especificar el producto"
            })
        } else {
            const product = await connection.query('DELETE FROM wantedcart WHERE rut_user = $1 and id_product = $2', [rut, id_product]);
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
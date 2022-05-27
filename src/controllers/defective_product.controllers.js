const connection = require('../config/db');

const getDefectiveProduct = async (req, res) => {
    try {
        const defective_products = await connection.query('SELECT * FROM defective_product');
        if (defective_products.rows.length === 0) {
            return res.status(400).json({
                msg: "No hay productos defectuosos"
            })
        }
        res.status(200).json({ defective_products: defective_products.rows });
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla de productos defectuosos",
            error
        })
    }

}

const createDefectiveProduct = async (req, res) => {
    try {
        const { id_sale, id_product, description} = req.body;
        if (id_sale == undefined || id_product == undefined) {
            return res.status(400).json({
                msg: "Debe especificar los campos."
            })
        } else {
            if (id_sale == "" || id_product == "") {
                return res.status(400).json({
                    msg: "Debe rellenar los campos."
                })
            }
            else {
                const defective_products = await connection.query('INSERT INTO product(id_sale,id_product,description) VALUES($1,$2,$3,$4)', [id_sale, id_product, description])
                res.status(200).json({
                    msg: `Se logro crear el producto defectuoso con id: ${id}`
                });
            }
        }
    } catch (error) {
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
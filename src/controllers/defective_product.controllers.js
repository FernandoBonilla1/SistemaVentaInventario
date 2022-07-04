const connection = require('../config/db');
const defective_productFunctions = {}

defective_productFunctions.getDefectiveProduct = async (req, res) => {
    try {
        const { id_sale, id_product } = req.body
        const defective_products = await connection.query('Select defective_product.id, sale.id as idventa, sale.date as fecha, product.id as idproducto, product.name as nombreproducto, defective_product.descripcion, defective_product.amount as amount from defective_product inner join sale on (sale.id = defective_product.id_sale) inner join product on (defective_product.id_product = product.id) Where sale.id = $1 and product.id = $2', [id_sale, id_product]);
        if (defective_products.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay productos defectuosos"
            })
        }
        res.status(200).json(defective_products.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla de productos defectuosos",
            error
        })
    }

}

defective_productFunctions.createDefectiveProduct = async (req, res) => {
    try {
        const { id_sale, id_product, description, amount } = req.body;
        if (id_sale == "" || id_product == "" || description == "" || amount == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            })
        }
        else {
            if(amount < 0){
                return res.status(400).json({
                    msg: "No se pueden ingresar valores negativos"
                })
            }else{
                const sale = await connection.query("select * from sale");
                const product = await connection.query("Select * from product where id = $1", [id_product]);
                if (sale.rows.length === 0 || product.rows.length === 0) {
                    return res.status(400).json({
                        msg: "No existe la venta o el producto."
                    })
                } else {
                    if (product.rows[0].amount < amount) {
                        return res.status(200).json({
                            msg: "No se puede reponer el producto."
                        })
                    } else {
                        const amountProduct = product.rows[0].amount - amount
                        const product1 = await connection.query("Update product set amount = $1 where id = $2", [amountProduct, id_product])
                        const defective_products = await connection.query('INSERT INTO defective_product(id_sale,id_product,descripcion, amount) VALUES($1,$2,$3,$4)', [id_sale, id_product, description, amount])
                        res.status(200).json({
                            msg: `Se logro crear el registro de producto defectuoso.`
                        });
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear el registro de productos defectuosos",
            error
        })
    }
}

defective_productFunctions.deleteDefectiveProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const defective_product1 = await connection.query('Select * from defective_product where id = $1', [id])
        if (defective_product1.rows.length === 0) {
            return res.status(400).json({
                msg: "El objeto defectuoso no existe"
            })
        } else {
            const defective_product2 = await connection.query('DELETE FROM defective_product WHERE id = $1', [id])
            res.status(200).json({
                msg: `Se logro eliminar el producto defectuoso.`
            });
        }

    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla de productos defectuosos",
            error
        })
    }
}

module.exports = defective_productFunctions
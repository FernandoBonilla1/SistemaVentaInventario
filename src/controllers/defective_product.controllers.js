const connection = require('../config/db');

const getDefectiveProduct = async (req, res) => {
    try {
        const{id_sale, id_product} = req.body
        const defective_products = await connection.query('Select defective_product.id, sale.id as idventa, sale.date as fecha, product.id as idproducto, product.name as nombreproducto, defective_product.desciption from defective_product inner join sale on (sale.id = defective_product.id_sale) inner join product on (defective_product.id_product = product.id) Where sale.id = $1 and product.id = $2',[id_sale, id_product]);
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

const createDefectiveProduct = async (req, res) => {
    try {
        const { id_sale, id_product, description} = req.body;
        if (id_sale == "" || id_product == "" || description == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            })
        }
        else {
            const sale = await connection.query("select * from sale");
            const product = await connection.query("Select * from product where id = $1", [id_product]);
            if(sale.rows.length === 0 || product.rows.length === 0){
                return res.status(200).json({
                    msg: "No existe la venta o el producto."
                })
            }else {
                const defective_products = await connection.query('INSERT INTO defective_product(id_sale,id_product,desciption) VALUES($1,$2,$3)', [id_sale, id_product, description])
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
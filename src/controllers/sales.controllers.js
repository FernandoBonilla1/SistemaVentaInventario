const connection = require('../config/db');

const getSale = async (req, res) => {
    try {
        const sales = await connection.query('SELECT * FROM sale');
        res.status(200).json({ sales: sales.rows });
    } catch (error) {
        res.status(500).json({
            msg: "No se puedieron acceder a la tabla de ventas",
            error
        })
    }
}

const addSale = async (req, res) => {
    try {
        const { id_cliente, id_salesman } = req.body;
        const date = Date.now();
        const hoy = new Date(date);
        const fecha_actual = hoy.toLocaleDateString();
        const sale = await connection.query('INSERT INTO sale(id_cliente,id_salesman,date) VALUES($1,$2,$3)', [id_cliente, id_salesman, fecha_actual]);
        const ultimoid = await connection.query('select sale.id from sale order by sale.id desc limit 1');
        res.status(200).json({
            id: ultimoid.rows[0].id
        });
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla ventas"
        })
    }
}

const addProductToSale = async (req, res) => {
    try {
        const { id, id_product, amount } = req.body
        if (amount < 0) {
            return res.status(400).json({
                msg: "No se puede ingresar estos valores."
            })
        } else {
            const Product1 = await connection.query("Select * from product WHERE product.id = $1", [id_product]);
            if (Product1.rows.length === 0) {
                return res.status(200).json({
                    msg: "No hay productos defectuosos"
                })
            } else {
                if (Product1.rows[0].amount < amount) {
                    return res.status(200).json({
                        msg: "No hay stock suficiente"
                    })
                } else {
                    const price = Product1.rows[0].value * amount
                    const product = await connection.query("INSERT INTO details(id_sale,id_product,amount,price) VALUES($1,$2,$3,$4)", [id, id_product, amount, price])
                    res.status(200).json({
                        msg: `Se ingreso el producto con id: ${id_product}`
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla detalles"
        })
    }
}

const confirmsale = async (req, res) => {

}

module.exports = {
    getSale,
    addSale,
    addProductToSale
}
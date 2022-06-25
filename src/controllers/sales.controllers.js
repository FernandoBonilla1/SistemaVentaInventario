const connection = require('../config/db');

const getSale = async (req, res) => {
    try {
        const {id} = req.body
        const sales = await connection.query('Select sale.id as id_sale, details.id_product as id_product, product.name as nombre, details.amount as amount, product.value as price_unit, details.price as price from sale inner join details on (sale.id = details.id_sale) inner join product on (details.id_product = product.id) WHERE sale.id = $1',[id]);
        if(sales.rows.length === 0){
            return res.status(200).json({
                msg: "No hay productos en la venta"
            })
        }
        res.status(200).json({ venta: sales.rows });
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
        console.log(fecha_actual)
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
                    msg: "El producto no existe"
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
    try{
        const {id,id_payment_method} = req.body
        const sale = await connection.query("UPDATE sale SET id_payment_method = $1 WHERE id = $2",[id_payment_method,id])
        try{
            const details = await connection.query("Select sale.id as id_sale, details.id_product as id_product, details.amount as purchased_amount, product.amount as product_amount, details.price as price from sale inner join details on (sale.id = details.id_sale) inner join product on (details.id_product = product.id) Where sale.id = $1",[id]);
            var price = 0
            for(var i = 0; i < details.rows.length;i++){
                var amount = details.rows[i].product_amount - details.rows[i].purchased_amount;
                price = price + details.rows[i].price
                var update = await connection.query("UPDATE product SET amount = $1 WHERE id = $2",[amount,details.rows[i].id_product])
            }
            res.status(200).json({
                msg: `Se completo la venta el total a pagar de la venta con id: ${id} es: $${price}`
            });
        }catch(error){
            res.status(500).json({
                msg: "No se pudo acceder a la tabla detalles"
            })
        }
    }catch(error){
        res.status(500).json({
            msg: "No se pudo acceder a la tabla ventas"
        })
    }
}

module.exports = {
    getSale,
    addSale,
    addProductToSale,
    confirmsale
}
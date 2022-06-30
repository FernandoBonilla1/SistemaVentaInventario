const connection = require('../config/db');

const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;
}

const getSale = async (req, res) => {
    try {
        const { id } = req.body
        const sales = await connection.query('Select sale.id as id_sale, details.id_product as id_product, product.name as nombre, details.amount as amount, product.value as price_unit, details.price as price from sale inner join details on (sale.id = details.id_sale) inner join product on (details.id_product = product.id) WHERE sale.id = $1', [id]);
        if (sales.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay productos en la venta"
            })
        }
        res.status(200).json(sales.rows);
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
        const cant = await connection.query('SELECT count(*) from sale')
        const id = `${generateRandomString(7) + cant.rows[0].count}`
        const id_sale = id.trim()
        const sale = await connection.query('INSERT INTO sale(id,id_cliente,id_salesman,date) VALUES($1,$2,$3,$4)', [id_sale, id_cliente, id_salesman, fecha_actual]);
        res.status(200).json({
            id: id_sale
        });
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla ventas"
        })
    }
}

const removeProductToSale = async (req, res) => {
    try {
        const { id, id_product } = req.body;
        if (id == "") {
            return res.status(400).json({
                msg: "Debe especificar el producto"
            })
        } else {
            const product1 = await connection.query('SELECT * FROM details Where id_sale = $1 and id_product = $2', [id, id_product]);
            if (product1.rows.length === 0) {
                return res.status(200).json({
                    msg: "El producto no esta en la venta"
                })
            } else {
                const product2 = await connection.query('DELETE FROM details Where id_sale = $1 and id_product = $2', [id, id_product]);
                res.status(200).json({
                    msg: `Se elimino el producto de la venta.`
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla detalles"
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
    try {
        const { id, id_payment_method } = req.body
        const sale = await connection.query("UPDATE sale SET id_payment_method = $1 WHERE id = $2", [id_payment_method, id])
        try {
            const details = await connection.query("Select sale.id as id_sale, details.id_product as id_product, details.amount as purchased_amount, product.amount as product_amount, details.price as price from sale inner join details on (sale.id = details.id_sale) inner join product on (details.id_product = product.id) Where sale.id = $1", [id]);
            var price = 0
            for (var i = 0; i < details.rows.length; i++) {
                var amount = details.rows[i].product_amount - details.rows[i].purchased_amount;
                price = price + details.rows[i].price
                var update = await connection.query("UPDATE product SET amount = $1 WHERE id = $2", [amount, details.rows[i].id_product])
            }
            res.status(200).json({
                id: id,
                total: price
            });
        } catch (error) {
            res.status(500).json({
                msg: "No se pudo acceder a la tabla detalles"
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla ventas"
        })
    }
}


const addSaleWantedCart = async (req, res) => {
    try {
        const { rut, id_salesman } = req.body;
        const user = await connection.query('select * from users where users.rut = $1', [rut])
        if (user.rows.length === 0) {
            return res.status(200).json({
                msg: "El usuario no existe"
            })
        }
        if (!user.rows[0].confirmcart) {
            return res.status(200).json({
                msg: "La lista de objetos deseados no esta confirmado"
            })
        } else {
            const wantedcart1 = await connection.query('select wantedcart.id_product , product.id as idproduct, product.name as name, product.id_subcategory as subcategory, subcategory.id_category as category, wantedcart.amount, product.url as url, product.amount as productamount, product.value from wantedcart inner join product on (wantedcart.id_product = product.id) inner join subcategory on (product.id_subcategory = subcategory.id) inner join category on (subcategory.id_category = category.id) inner join users on (wantedcart.rut_user = users.rut) Where wantedcart.rut_user = $1', [rut]);
            if (wantedcart1.rows.length === 0) {
                return res.status(200).json({
                    msg: "No hay productos en tu lista de deseados"
                })
            }
            const wantedcart2 = await connection.query('select wantedcart.id, wantedcart.id_product, product.name as name, product.id_subcategory as subcategory, subcategory.id_category as category, wantedcart.amount, product.url as url, product.value as price, product.amount as productamount from wantedcart inner join product on (wantedcart.id_product = product.id) inner join subcategory on (product.id_subcategory = subcategory.id) inner join category on (subcategory.id_category = category.id) Where wantedcart.rut_user = $1 and wantedcart.amount > product.amount', [rut])
            if (wantedcart2.rows.length === 0) {
                const date = Date.now();
                const hoy = new Date(date);
                const fecha_actual = hoy.toLocaleDateString();
                const cant = await connection.query('SELECT count(*) from sale')
                const id = `${generateRandomString(7) + cant.rows[0].count}`
                const id_sale = id.trim()
                const sale = await connection.query('INSERT INTO sale(id,id_cliente,id_salesman,date) VALUES($1,$2,$3,$4)', [id_sale, rut, id_salesman, fecha_actual]);
                try {
                    var price = 0;
                    for (var i = 0; i < wantedcart1.rows.length; i++) {
                        price = wantedcart1.rows[i].amount * wantedcart1.rows[i].value
                        var amount = wantedcart1.rows[i].amount;
                        var id_product = wantedcart1.rows[i].id_product;
                        var insert = await connection.query("INSERT INTO details(id_sale,id_product,amount,price) VALUES($1,$2,$3,$4)", [id_sale, id_product, amount, price])
                        price = 0
                    }
                    res.status(200).json({
                        id: id_sale
                    });
                } catch (error) {
                    res.status(500).json({
                        msg: "No se pudo agregar los productos a detalles"
                    })
                }
            } else {
                return res.status(200).json(wantedcart2.rows)
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear la venta"
        })
    }
}

const confirmsaleWantedCart = async (req, res) => {
    try {
        const { id, id_payment_method } = req.body
        
        const sale = await connection.query("UPDATE sale SET id_payment_method = $1 WHERE id = $2", [id_payment_method, id])
        console.log("aaaaa")
        try {
            const details = await connection.query("Select sale.id as id_sale, sale.id_cliente as rut, details.id_product as id_product, details.amount as purchased_amount, product.amount as product_amount, details.price as price from sale inner join details on (sale.id = details.id_sale) inner join product on (details.id_product = product.id) Where sale.id = $1", [id]);
            var price = 0
            
            for (var i = 0; i < details.rows.length; i++) {
                var amount = details.rows[i].product_amount - details.rows[i].purchased_amount;
                price = price + details.rows[i].price
                var update = await connection.query("UPDATE product SET amount = $1 WHERE id = $2", [amount, details.rows[i].id_product])
            }
            const rut = details.rows[0].rut
            const clear = await connection.query(`DELETE FROM wantedcart WHERE rut_user = $1`,[rut])
            res.status(200).json({
                id: id,
                total: price
            });
        } catch (error) {
            res.status(500).json({
                msg: "No se pudo acceder a la tabla detalles"
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla ventas"
        })
    }
}


module.exports = {
    getSale,
    addSale,
    addProductToSale,
    confirmsale,
    removeProductToSale,
    addSaleWantedCart,
    confirmsaleWantedCart
}
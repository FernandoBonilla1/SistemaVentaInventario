const connection = require('../config/db');
const defective_productFunctions = {}

defective_productFunctions.getDefectiveProduct = async (req, res) => {
    try {
        const { id_sale } = req.body
        let get_defective_product = 'Select defective_product.id, sale.id as idventa, product.id as idproducto, product.name as nombreproducto, defective_product.descripcion, defective_product.amount as amount from defective_product inner join sale on (sale.id = defective_product.id_sale) inner join product on (defective_product.id_product = product.id) Where sale.id = $1'
        const defective_products = await connection.query( get_defective_product, [id_sale]);
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
            if (amount < 0) {
                return res.status(400).json({
                    msg: "No se pueden ingresar valores negativos"
                })
            } else {
                let get_sale = "select * from sale"
                const sale = await connection.query(get_sale);
                let get_product = "Select * from product where id = $1"
                const product = await connection.query( get_product, [id_product]);
                let get_details = "Select * from details where id_product = $1 and id_sale = $2"
                const product_sale1 = await connection.query( get_details, [id_product, id_sale])
                if (sale.rows.length === 0 || product.rows.length === 0) {
                    return res.status(400).json({
                        msg: "No existe la venta o el producto."
                    })
                } else {
                    if (product_sale1.rows.length === 0) {
                        return res.status(200).json({
                            msg: "El producto no esta en la venta."
                        })
                    } else {
                        if(product.rows[0].amount < amount){
                            let price = product.rows[0].value * amount
                            return res.status(200).json({
                                msg: "No se puede reponer el producto no hay stock. Se devolvera el dinero o se cambiara por otro producto.",
                                price: price
                            })
                        } else {
                            let amount_product = product_sale1.rows[0].amount - amount
                            let update_details_sale = "UPDATE details set amount = $1 where id_product = $2 and id_sale = $3"
                            const update_details = await connection.query( update_details_sale, [amount_product, id_product, id_sale])
                            const amountProduct = product.rows[0].amount - amount
                            let update_product = "Update product set amount = $1 where id = $2"
                            const product1 = await connection.query( update_product, [amountProduct, id_product])
                            let insert_defective_product = 'INSERT INTO defective_product(id_sale,id_product,descripcion, amount) VALUES($1,$2,$3,$4)'
                            const defective_products = await connection.query( insert_defective_product, [id_sale, id_product, description, amount])
                            res.status(200).json({
                                msg: `Se logro crear el registro de producto defectuoso.`
                            });
                        }
                        
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
        let get_defective_product = 'Select * from defective_product where id = $1'
        const defective_product1 = await connection.query( get_defective_product, [id])
        if (defective_product1.rows.length === 0) {
            return res.status(400).json({
                msg: "El objeto defectuoso no existe"
            })
        } else {
            let delete_defective_product = 'DELETE FROM defective_product WHERE id = $1'
            const defective_product2 = await connection.query( delete_defective_product, [id])
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

defective_productFunctions.create_Return_Product = async (req, res) => {
    try {
        const { id_sale, id_product, description, amount } = req.body;
        if (id_sale == "" || id_product == "" || description == "" || amount == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            })
        } else {
            if (amount < 0) {
                return res.status(400).json({
                    msg: "No puede ingresar valores negativos"
                })
            } else {
                let get_product = "Select * from product where id = $1"
                const product = await connection.query(get_product, [id_product])
                let get_sale = "Select * from sale where id = $1"
                const sale = await connection.query( get_sale, [id_sale])
                let get_details = "Select * from details where id_product = $1 and id_sale = $2"
                const product_sale1 = await connection.query( get_details, [id_product, id_sale])
                if (product.rows.length === 0) {
                    return res.status(400).json({
                        msg: "El producto no existe"
                    })
                } else {
                    if (sale.rows.length === 0) {
                        return res.status(400).json({
                            msg: "La venta no existe"
                        })
                    } else {
                        if(product_sale1.rows.length === 0){
                            return res.status(400).json({
                                msg: "El producto no existe en la venta"
                            })
                            
                        } else {
                            if (product_sale1.rows[0].amount < amount) {
                                return res.status(400).json({
                                    msg: "No puede devolver una cantidad mayor que la obtenida en la venta"
                                })
                            } else {
                                let amount_product = product_sale1.rows[0].amount - amount
                                let update_product_details = "UPDATE details set amount = $1 where id_product = $2 and id_sale = $3"
                                const update_details = await connection.query( update_product_details, [amount_product, id_product, id_sale])
                                let amounts = product.rows[0].amount + amount
                                let price = product.rows[0].value * amount
                                let insert_return_products = "INSERT INTO return(id_sale,id_product,description,amount,price) VALUES ($1,$2,$3,$4,$5)"
                                const return_products = await connection.query( insert_return_products, [id_sale, id_product, description, amount, price])
                                let update_product_amount = 'UPDATE product SET amount = $1 WHERE id = $2'
                                const update_product = await connection.query( update_product_amount, [amounts, id_product])
                                res.status(200).json({
                                    msg: "Se genero una devolucion de producto"
                                })
                            }
                        }
                        
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo realizar la devolucion del producto",
            error
        })
    }
}

defective_productFunctions.getreturn_Products = async (req, res) => {
    try {
        const { id_sale } = req.body;
        let get_return_product = 'select return.id, return.id_sale, return.id_product, return.description, product.name, return.price from return inner join product on (product.id = return.id_product) where return.id_sale = $1'
        const return_products = await connection.query( get_return_product, [id_sale]);
        if (return_products.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay productos devueltos"
            })
        }
        res.status(200).json(return_products.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla productos devueltos",
            error
        })
    }   
}


defective_productFunctions.deleteReturnsProduct = async (req, res) => {
    try {
        const { id } = req.body;
        let get_return_product = 'Select * from return where id = $1'
        const return_product1 = await connection.query( get_return_product, [id])
        if (return_product1.rows.length === 0) {
            return res.status(400).json({
                msg: "El objeto defectuoso no existe"
            })
        } else {
            let delete_return_product = 'DELETE FROM return WHERE id = $1'
            const return_product2 = await connection.query( delete_return_product, [id])
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
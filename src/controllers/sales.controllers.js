
const connection = require('../config/db');
const functions = require('../helpers/functionshelper');
const salesFunctions = {}

salesFunctions.getpayment_method = async (req, res) => { //Se obtienen los medios de pago
    try {
        let get_payment_method = 'SELECT * FROM payment_method'
        const payment_method = await connection.query(get_payment_method); 
        if (payment_method.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay metodos de pago"
            })
        }
        res.status(200).json(payment_method.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla subcategory",
            error
        })
    }
}

salesFunctions.getSale = async (req, res) => { //Se obtiene una venta por el id
    try {
        const { id } = req.body
        let get_sale = 'Select sale.id as id_sale, sale.id_cliente as cliente, sale.id_payment_method, details.id_product as id_product, product.name as nombre, details.amount as amount, product.value as price_unit, details.price as price from sale inner join details on (sale.id = details.id_sale) inner join product on (details.id_product = product.id) WHERE sale.id = $1'
        const sales = await connection.query( get_sale, [id]); //Se busca la venta por id
        if (sales.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay productos en la venta"
            })
        } else {
            if (sales.rows[0].id_payment_method != null) { //Si el medio de pago de la venta es distinta de null no se puede obtener
                return res.status(400).json({
                    msg: "No se puede acceder a una boleta que ya fue finalizada"
                })
            }
            res.status(200).json(sales.rows);
        }

    } catch (error) {
        res.status(500).json({
            msg: "No se puedieron acceder a la tabla de ventas",
            error
        })
    }
}

salesFunctions.addSale = async (req, res) => { //Se crea la venta
    try {
        const { id_cliente, id_salesman } = req.body;
        const fecha_actual = functions.getCurrentDate(); //Se obtiene la fecha actual en formato YYYY-MM-DD
        const cant = await connection.query('SELECT count(*) from sale') //Se cuenta la cantidad de ventas que hay
        const id = `${functions.generateRandomString(7) + cant.rows[0].count}` //Se genera un codigo random para la venta
        const id_sale = id.trim()
        let get_user_rut = "select * from users where rut = $1"
        const client = await connection.query( get_user_rut, [id_cliente]); //Se busca el cliente por el rut
        if (client.rows.length === 0) {
            return res.status(400).json({
                msg: "El cliente no existe"
            })
        }
        let insert_sale = 'INSERT INTO sale(id,id_cliente,id_salesman,date) VALUES($1,$2,$3,$4)'
        const sale = await connection.query( insert_sale, [id_sale, id_cliente, id_salesman, fecha_actual]); //Se inserta la venta
        res.status(200).json({
            id: id_sale,
            rut_cliente: id_cliente
        });
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla ventas"
        })
    }
}

salesFunctions.removeProductToSale = async (req, res) => { //Remover producto de una venta
    try {
        const { id, id_product } = req.body;
        if (id == "") {
            return res.status(400).json({
                msg: "Debe especificar el producto"
            })
        } else {
            let get_details = 'SELECT * FROM details Where id_sale = $1 and id_product = $2'
            const product1 = await connection.query( get_details, [id, id_product]); //se busca si el producto esta en la venta
            if (product1.rows.length === 0) {
                return res.status(200).json({
                    msg: "El producto no esta en la venta"
                })
            } else {
                let get_sale_id = "Select * from sale where id = $1"
                const sale = await connection.query( get_sale_id, [id]); //Se obtiene la venta
                if (sale.rows[0].id_payment_method != null) { //se verifica si la cuenta esta verificada
                    return res.status(400).json({
                        msg: "No puede interactuar con una venta que ya fue finalizada."
                    })
                } else {
                    let delete_details = 'DELETE FROM details Where id_sale = $1 and id_product = $2'
                    const product2 = await connection.query( delete_details, [id, id_product]); //Se elimina el producto de la venta
                    res.status(200).json({
                        msg: `Se elimino el producto de la venta.`
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla detalles"
        })
    }
}

salesFunctions.addProductToSale = async (req, res) => { //Se agrega el producto a la venta
    try {
        const { id, id_product, amount } = req.body
        if (amount < 0) {  //Se verifica que no ingrese productos con valores negativos
            return res.status(400).json({
                msg: "No se puede ingresar estos valores."
            })
        } else {
            let get_product_id = "Select * from product WHERE product.id = $1"
            const Product1 = await connection.query( get_product_id, [id_product]); //Se busca el producto por la id
            if (Product1.rows.length === 0) {
                return res.status(200).json({
                    msg: "El producto no existe"
                })
            } else {
                let get_sale_id = "Select * from sale where id = $1"
                const sale = await connection.query( get_sale_id, [id]); //Se busca la venta por id
                if (sale.rows[0].id_payment_method != null) { //Se verifica si la venta esta finalizada
                    return res.status(400).json({
                        msg: "No puede interactuar con una venta que ya fue finalizada."
                    })
                } else {
                    if (Product1.rows[0].amount < amount) { //Se verifica si hay stock suficiente para abastecer la venta
                        return res.status(200).json({
                            msg: "No hay stock suficiente"
                        })
                    } else {
                        const price = Product1.rows[0].value * amount
                        let insert_product_details = "INSERT INTO details(id_sale,id_product,amount,price) VALUES($1,$2,$3,$4)"
                        const product = await connection.query( insert_product_details, [id, id_product, amount, price]) //Se ingresa el producto a la venta
                        res.status(200).json({
                            msg: `Se ingreso el producto con id: ${id_product}`
                        });
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla detalles"
        })
    }
}

salesFunctions.confirmsale = async (req, res) => { //Se confirma y se cierra la venta
    try {
        const { id, id_payment_method } = req.body
        let update_sale = "UPDATE sale SET id_payment_method = $1 WHERE id = $2"
        const sale = await connection.query( update_sale, [id_payment_method, id]) //Se actualiza el id del modo de pago a la venta
        try {
            let get_details = "Select sale.id as id_sale, details.id_product as id_product, details.amount as purchased_amount, product.amount as product_amount, details.price as price from sale inner join details on (sale.id = details.id_sale) inner join product on (details.id_product = product.id) Where sale.id = $1"
            const details = await connection.query( get_details, [id]);
            var price = 0
            for (var i = 0; i < details.rows.length; i++) {
                var amount = details.rows[i].product_amount - details.rows[i].purchased_amount;
                price = price + details.rows[i].price
                let update_product = "UPDATE product SET amount = $1 WHERE id = $2"
                var update = await connection.query( update_product, [amount, details.rows[i].id_product]) //Se resta la cantidad del producto al stock de bodega
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


salesFunctions.addSaleWantedCart = async (req, res) => { //Se agrega el carrito a la venta
    try {
        const { rut, id_salesman, id_sale } = req.body;
        let get_users_rut = 'select * from users where users.rut = $1'
        const user = await connection.query( get_users_rut, [rut]) //Se busca el cliente por rut
        if (user.rows.length === 0) {
            return res.status(200).json({
                msg: "El usuario no existe"
            })
        }
        if (!user.rows[0].confirmcart) { //Se verifica si el carrito esta confirmado
            return res.status(200).json({
                msg: "La lista de objetos deseados no esta confirmado"
            })
        } else {
            let get_wantedcart = 'select wantedcart.id_product , product.id as idproduct, product.name as name, product.id_subcategory as subcategory, subcategory.id_category as category, wantedcart.amount, product.url as url, product.value as price, product.amount as productamount, product.value from wantedcart inner join product on (wantedcart.id_product = product.id) inner join subcategory on (product.id_subcategory = subcategory.id) inner join category on (subcategory.id_category = category.id) inner join users on (wantedcart.rut_user = users.rut) Where wantedcart.rut_user = $1'
            const wantedcart1 = await connection.query( get_wantedcart, [rut]); //Se verifica si hay productos en el carrito
            if (wantedcart1.rows.length === 0) {
                return res.status(200).json({
                    msg: "No hay productos en tu lista de deseados"
                })
            }
            let get_wantedcart1 = 'select wantedcart.id, wantedcart.id_product, product.name as name, product.id_subcategory as subcategory, subcategory.id_category as category, wantedcart.amount, product.url as url, product.value as price, product.amount as productamount from wantedcart inner join product on (wantedcart.id_product = product.id) inner join subcategory on (product.id_subcategory = subcategory.id) inner join category on (subcategory.id_category = category.id) Where wantedcart.rut_user = $1 and wantedcart.amount > product.amount'
            const wantedcart2 = await connection.query( get_wantedcart1, [rut]) //Se verifica si la cantidad del producto que tiene el carrito no excede lo que hay en stock en bodega
            if (wantedcart2.rows.length === 0) {
                var price = 0;
                for (var i = 0; i < wantedcart1.rows.length; i++) {
                    price = wantedcart1.rows[i].price * wantedcart1.rows[i].amount;
                    var insert = await connection.query('INSERT INTO details (id_sale,id_product,amount,price) VALUES($1,$2,$3,$4)', [id_sale, wantedcart1.rows[i].id_product, wantedcart1.rows[i].amount, price]); //Se agrega el producto a la venta
                    price = 0
                }
                const clear = await connection.query(`DELETE FROM wantedcart WHERE rut_user = $1`, [rut]) //Se elimina los productos del carrito del cliente
                const verifycart = await connection.query('UPDATE users SET confirmcart = $1 WHERE rut = $2', [false, rut]) //El estado del carrito se modifica a false
                res.status(200).json({
                    msg: "Se ingreso la lista de los deseados a la boleta",
                    id_sale: id_sale,
                    rut: rut
                })
            } else {
                return res.status(400).json(wantedcart2.rows) //En el caso que hayan productos que no tengan suficiente stock se muestran que objetos son
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear la venta",
            error: error
        })
    }
}

salesFunctions.deleteRecordsOfTwoYears = async (req, res) => { //Se eliminan registros de 2 años atras
    try {
        let get_sale = "Select sale.id, sale.date from sale"
        const sales = await connection.query(get_sale) //Se obtienen las ventas
        const date = functions.getCurrentDate() //Se obtiene la fecha actual
        const division = date.split('-')
        const anno = division[0] - 2
        const dateTwoYearBefore = new Date(`${anno}-${division[1]}-${division[2]}`)
        const registros = sales.rows.map((sale) => { //Se crean arreglos con los datos de las ventas utilizando id y fecha
          const registro = {
              id: sale.id,
              date: new Date(sale.date)
          }
          return registro
      })
      for(var i = 0;i < registros.length; i++){
        if(registros[i].date < dateTwoYearBefore){ //En el caso que la fecha sea de 2 años antes
            let delete_details = "Delete from details where id_sale = $1"
            let delete_sale = "Delete from sale where id = $1"
            var delete_records_details = await connection.query( delete_details,[registros[i].id]) //Se eliminan los registros de los productos de la venta
            var delete_records_sale = await connection.query( delete_sale,[registros[i].id]) //Se elimina el registro de la venta
        }
      }
      res.status(200).json({msg: "Se eliminaron los registros de hace 2 años"})
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo eliminar los registros.",
            error: error
        })
    }

}

module.exports = salesFunctions
const connection = require('../config/db');
const wishCart = {}

wishCart.getWantedCart = async (req, res) => { //Obtener el carrito del cliente
    try {
        const { rut } = req.body;
        let get_user = 'select * from users where users.rut = $1' 
        const user = await connection.query( get_user, [rut]) //Se busca el usuario por medio del rut
        if (user.rows.length === 0) { //Si no hay ninguna coincidencia en el resultado de la consulta, significa que no existe el usuario
            return res.status(200).json({
                msg: "El usuario no existe"
            })
        }
        let get_wishcart_user = 'select wantedcart.id, wantedcart.id_product, product.name as name, product.id_subcategory as subcategory, subcategory.id_category as category, wantedcart.amount, product.url as url, product.value as price, users.confirmcart as confirmcart from wantedcart inner join product on (wantedcart.id_product = product.id) inner join subcategory on (product.id_subcategory = subcategory.id) inner join category on (subcategory.id_category = category.id) inner join users on (wantedcart.rut_user = users.rut) Where wantedcart.rut_user = $1'
        const wantedcart = await connection.query( get_wishcart_user, [rut]); //Se obtener el carrito del cliente
        if (wantedcart.rows.length === 0) {//Si el cliente no tiene nada en el carrito
            return res.status(200).json({
                msg: "No hay productos en tu lista de deseados"
            })
        }
        res.status(200).json(wantedcart.rows); //Se retorna las filas con la informacion de los objetos que el cliente tiene en su carrito
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla wantedcart",
            error
        })
    }
}

wishCart.addProductWantedCart = async (req, res) => { //Agregar producto al carro
    try {
        const { rut, id_product, amount } = req.body;
        let get_user_rut = 'select * from users where users.rut = $1'
        const user = await connection.query( get_user_rut, [rut]) //Se verifica si el cliente existe
        if (user.rows[0].confirmcart) { //Se verifica si el carro del cliente esta confirmado
            res.status(400).json({
                msg: "No puede ingresar productos a un carrito confirmado"
            })
        } else {
            if (amount < 0) { //Verifica que no se ingresen valores negativos
                return res.status(400).json({
                    msg: "No puede ingresar valores negativos."
                })
            } else {
                let get_product_id = "Select * from product where product.id = $1"
                const product1 = await connection.query( get_product_id, [id_product]) //Se verifica si el producto ingresado existe
                if (product1.rows.length === 0) {
                    return res.status(200).json({
                        msg: "No existe el producto"
                    })
                }
                let get_wantedcart = 'select * from wantedcart inner join product on (wantedcart.id_product = product.id) where wantedcart.id_product = $1 and wantedcart.rut_user = $2'
                const product2 = await connection.query( get_wantedcart, [id_product, rut]) //Se verifica si el articulo esta en el carrito
                if (product2.rows.length === 0) {
                    const insert_product = 'INSERT INTO wantedcart(rut_user, id_product, amount) VALUES($1,$2,$3)'
                    const product3 = await connection.query( insert_product, [rut, id_product, amount])
                    return res.status(200).json({
                        msg: `Se logro agregar el producto al carrito id: ${id_product}`
                    });
                } else {
                    return res.status(200).json({ //En el caso que este en el carrito retorna 1 para notificar que ya existe
                        code: 1
                    })
                }

            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla wantedcart",
            error
        })
    }
}

wishCart.ModifyWantedCart = async (req, res) => { //Modificar la cantidad de un producto en el carrito
    try {
        const { rut, id_product, amount } = req.body;
        if (amount < 0) { //Se verifica si se ingresan valores negativos
            return res.status(400).json({
                msg: "No puede ingresar valores negativos."
            })
        } else {
            let update_wantedcart = 'UPDATE wantedcart SET amount = $1 WHERE rut_user = $2 and id_product = $3'
            const product = await connection.query( update_wantedcart, [amount, rut, id_product]) //se actualiza la cantidad del producto en el carrito
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

wishCart.deleteProductWantedCart = async (req, res) => { //Eliminar producto del carrito
    try {
        const { rut, id_product } = req.body;
        if (id_product == "") {
            return res.status(400).json({
                msg: "Debe especificar el producto"
            })
        } else {
            let get_user_rut = 'select * from users where users.rut = $1'
            const user = await connection.query( get_user_rut, [rut]) // Verifica si el rut existe
            if (user.rows[0].confirmcart) { //Verifica si el carro esta confirmado
                res.status(400).json({
                    msg: "No puede eliminar productos a un carrito confirmado"
                })
            } else {
                let get_wantedcart = 'select * from wantedcart inner join product on (wantedcart.id_product = product.id) where wantedcart.id_product = $1 and wantedcart.rut_user = $2'
                const product1 = await connection.query( get_wantedcart, [id_product, rut]) //Verifica si el producto esta en el carro
                if (product1.rows.length === 0) {
                    return res.status(200).json({
                        msg: "No existe el producto en la lista"
                    })
                }
                let delete_product = 'DELETE FROM wantedcart WHERE rut_user = $1 and id_product = $2'
                const product2 = await connection.query( delete_product, [rut, id_product]); //Se elimina el producto del carrito
                res.status(200).json({
                    msg: `Se elimino el producto de la lista de deseados.`
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

wishCart.modifystateWantedCart = async (req, res) => { //Se modifica el estado del carrito
    try {
        const { rut, confirmcart } = req.body;
        let get_user_rut = 'select * from users where users.rut = $1'
        const user = await connection.query( get_user_rut, [rut]) //Se verifica si el usuario existe
        if (user.rows.length === 0) {
            return res.status(200).json({
                msg: "El usuario no existe"
            })
        }
        let update_confirmcart = 'UPDATE users SET confirmcart = $1 WHERE rut = $2'
        const verifycart = await connection.query( update_confirmcart, [confirmcart, rut]) //Se actualiza el estado del carrito
        res.status(200).json({
            msg: `Se modifico el estado del carrito del usuario con rut: ${rut}`
        })
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla usuario"
        })
    }
}

module.exports = wishCart
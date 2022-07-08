const connection = require('../config/db');
const fs = require("fs");

const uploadImageFunction = {}

uploadImageFunction.uploadImageProduct = async (req, res) => {
    try {
        let { base64Data, id_product } = req.body
        if (base64Data == "") {
            return res.status(400).json({
                msg: "Debe enviar el string en base 64"
            })
        } else {
            let get_product_id = "select * from product where id = $1"
            const product = await connection.query( get_product_id,[id_product]);
            if(product.rows.length === 0){
                return res.status(400).json({
                    msg: "El producto no existe"
                })
            } else {
                fs.writeFileSync(`src/upload/category/category${id_product}.png`, base64Data.replace("data:image/png;base64,", ""), 'base64');
                try{
                    let update_url_product = "UPDATE product set url = $1 where id = $2"
                    var product1 = await connection.query( update_url_product, [base64Data, id_product])
                    res.status(200).json({
                        msg: "Se subio la imagen"
                    })
                }catch(error){
                    res.status(500).json({
                        msg: "No se pudo subir el string base 64 a la columna url",
                        error
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo subir la imagen",
            error
        })
    }
}

uploadImageFunction.uploadImageCategory = async (req, res) => {
    try {
        let { base64Data, id_category } = req.body
        if (base64Data == "") {
            return res.status(400).json({
                msg: "Debe enviar el string en base 64"
            })
        } else {
            let get_category_id = "select * from category where id = $1"
            const category = await connection.query( get_category_id,[id_category]);
            if(category.rows.length === 0){
                return res.status(400).json({
                    msg: "La categoria no existe"
                })
            } else {
                fs.writeFileSync(`src/upload/category/category${id_category}.png`, base64Data.replace("data:image/png;base64,", ""), 'base64');
                try{
                    let update_url_category = "UPDATE category set url = $1 where id = $2"
                    var category1 = await connection.query( update_url_category, [base64Data, id_category])
                    res.status(200).json({
                        msg: "Se subio la imagen"
                    })
                }catch(error){
                    res.status(500).json({
                        msg: "No se pudo subir el string base 64 a la columna url",
                        error
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo subir la imagen",
            error
        })
    }
}

uploadImageFunction.getImageProductBase64 = async (req, res) => {
    try {
        const { id_product } = req.body;
        let get_product_id = "Select * from product where id = $1"
        const product = await connection.query( get_product_id, [id_product])
        if (product.rows.length === 0) {
            return res.status(400).json({
                msg: "No existe el producto"
            })
        } else {
            let path = `src/upload/products/product${id_product}.png`
            const data = fs.readFileSync(path);
            const image = "data:image/png;base64," + data.toString('base64');
            return res.status(200).json({
                foto: image
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear la imagen en base 64",
            error
        })
    }
}

uploadImageFunction.changeurlProduct = async (req, res) => {
    try {
        let get_product = "select * from product"
        const product = await connection.query(get_product)
        for (var i = 0; i < product.rows.length; i++) {
            let path = `src/upload/products/product${product.rows[i].id}.png`
            const data = fs.readFileSync(path);
            const image = "data:image/png;base64," + data.toString('base64');
            let update_url = "UPDATE product set url = $1 where id = $2"
            var product1 = await connection.query( update_url, [image, product.rows[i].id])
        }
        res.status(200).json({
            msg: "Se actualizaron la url"
        })
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear la imagen en base 64",
            error
        })
    }
}

uploadImageFunction.changeurlCategory = async (req, res) => {
    try {
        let get_category = "select * from category"
        const category = await connection.query(get_category)
        for (var i = 0; i < category.rows.length; i++) {
            let path = `src/upload/category/category${category.rows[i].id}.png`
            const data = fs.readFileSync(path);
            const image = "data:image/png;base64," + data.toString('base64');
            let update_url = "UPDATE category set url = $1 where id = $2"
            var category1 = await connection.query( update_url, [image, category.rows[i].id])
        }
        res.status(200).json({
            msg: "Se actualizaron la url"
        })
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear la imagen en base 64",
            error
        })
    }
}

module.exports = uploadImageFunction
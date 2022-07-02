const connection = require('../config/db');
const fs = require("fs");


const uploadImageProduct = async (req, res) => {
    try {
        let { base64Data, id_product } = req.body
        base64Data = base64Data.replace("data:image/jpg;base64,", "");

        fs.writeFileSync(`upload/products/product${id_product}.png`, base64Data, 'base64');
        res.status(200).json({
            msg: base64Data
        })
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear la imagen en base 64",
            error
        })
    }
}



const getImageProductBase64 = async (req, res) => {
    try {
        const { id_product } = req.body;
        const product = await connection.query("Select * from product where id = $1", [id_product])
        if (product.rows.length === 0) {
            return res.status(400).json({
                msg: "No existe el producto"
            })
        } else {
            let path = `upload/products/product${id_product}.png`
            const data = fs.readFileSync(path);
            const image = "data:image/jpg;base64," + data.toString('base64');
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

module.exports = {
    getImageProductBase64,
    uploadImageProduct
}
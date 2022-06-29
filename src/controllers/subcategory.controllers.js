const connection = require('../config/db');

const getSubCategory = async (req, res) => {
    try {
        const subcategory = await connection.query('SELECT * FROM subcategory');
        if (subcategory.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay subcategorias"
            })
        }
        res.status(200).json(subcategory.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla subcategory",
            error
        })
    }
}


const createSubCategory = async (req, res) => {
    try {
        const { name, description, id_category } = req.body;
        const removed = false;
        if (name == undefined || id_category == undefined) {
            return res.status(401).json({
                msg: "Debe incluir todos los campos."
            });
        } else {
            if (name == "" || id_category == "") {
                return res.status(401).json({
                    msg: "La subcategoria debe incluir nombre e id de categoria."
                });
            } else {
                const subcategory = await connection.query('INSERT INTO subcategory(name,description,removed,id_category) VALUES($1,$2,$3,$4)', [name, description, removed, id_category])
                res.status(200).json({
                    msg: `Se logro crear la subcategoria con nombre: ${name}`
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla subcategory",
            error
        })
    }
}

module.exports = {
    getSubCategory,
    createSubCategory
}
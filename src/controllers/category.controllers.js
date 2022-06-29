const connection = require('../config/db');

const getCategory = async (req, res) => {
    try {
        const category = await connection.query('SELECT * FROM category');
        if (category.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay categorias"
            })
        }
        res.status(200).json(category.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla category",
            error
        })
    }
}

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const removed = false;
        if (name == undefined || description == undefined) {
            return res.status(401).json({
                msg: "Debe incluir todos los campos."
            });
        } else {
            if (name == "") {
                return res.status(401).json({
                    msg: "La categoria debe incluir nombre."
                });
            } else {
                const category = await connection.query('INSERT INTO category(name,description,removed) VALUES($1,$2,$3)', [name, description, removed])
                res.status(200).json({
                    msg: `Se logro crear la categoria con nombre: ${name}`
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla category",
            error
        })
    }
}

module.exports = {
    getCategory,
    createCategory
}
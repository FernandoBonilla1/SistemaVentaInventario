const connection = require('../config/db');
const capitalizar = require("./products.controller")

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
        if (name == "" || id_category == "") {
            return res.status(401).json({
                msg: "La subcategoria debe incluir nombre e id de categoria."
            });
        } else {
            const category = await connection.query('SELECT * FROM category where id = $1',[id_category])
            if(category.rows.length === 0){
                return res.status(200).json({
                    msg: "No existe la categoria"
                })
            }
            const subcategory = await connection.query('INSERT INTO subcategory(name,description,removed,id_category) VALUES($1,$2,$3,$4)', [name, description, removed, id_category])
            res.status(200).json({
                msg: `Se logro crear la subcategoria con nombre: ${name}`
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla subcategory",
            error
        })
    }
}

const searchsubcategory = async (req, res) => {
    try {
        const { name } = req.body;
        nameCapitalize = capitalizar.capitalizarPrimeraLetra(name)
            const categories = await connection.query(`SELECT * FROM subcategory where name LIKE '${nameCapitalize}%'`);
            if (categories.rows.length === 0) {
                return res.status(200).json({
                    msg: "No hay subcategorias"
                });
            }
            res.status(200).json(categories.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla subcategory",
            error
        })
    }
}

const modifysubcategory = async (req, res) => {
    try {
        const { id, name, description } = req.body;
        if (id == "" || name == "" || description == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            });
        } else {
            const categories = await connection.query("Select * from subcategory where id = $1", [id])
            if (categories.rows.length === 0) {
                return res.status(200).json({
                    msg: "La subcategoria no existe"
                });
            } else {
                const categories1 = await connection.query('UPDATE subcategory SET name = $1, description = $2 WHERE id = $3', [name, description, id])
                res.status(200).json({
                    msg: `Se ha actualizo la subcategoria`
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

const changeStatussubCategory = async (req, res) => {
    try {
        const { id, removed } = req.body;
        if (id == "") {
            return res.status(400).json({
                msg: "Debe especificar el id de la categoria para removerlo"
            })
        } else {
            const subcategories = await connection.query("Select * from subcategory where id = $1", [id]);
            if (subcategories.rows.length === 0) {
                return res.status(200).json({
                    msg: "La subcategoria no existe"
                });
            } else {
                const subcategories1 = await connection.query('UPDATE subcategory SET removed = $1 WHERE id = $2', [removed, id])
                res.status(200).json({
                    msg: `Se actualizo el estado de la subcategoria con id: ${id}`
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
    createSubCategory,
    searchsubcategory,
    modifysubcategory,
    changeStatussubCategory
}
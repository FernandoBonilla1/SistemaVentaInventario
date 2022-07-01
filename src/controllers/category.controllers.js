const connection = require('../config/db');
const capitalizar = require("./products.controller")

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
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla category",
            error
        })
    }
}

const searchcategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (name == "") {
            return res.status(400).json({
                msg: "Debe escribir el nombre de la categoria"
            });
        } else {
            nameCapitalize = capitalizar.capitalizarPrimeraLetra(name)
            const categories = await connection.query(`SELECT * FROM category where name LIKE '${nameCapitalize}%'`);
            if (categories.rows.length === 0) {
                return res.status(200).json({
                    msg: "No hay categorias"
                });
            }
            res.status(200).json(categories.rows);
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla category",
            error
        })
    }
}

const modifycategory = async (req, res) => {
    try {
        const { id, name, description} = req.body;
        if (id == "" || name == "" || description == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            });
        } else {
            const categories = await connection.query("Select * from category where id = $1", [id])
            if (categories.rows.length === 0) {
                return res.status(200).json({
                    msg: "La categoria no existe"
                });
            } else {
                const categories1 = await connection.query('UPDATE category SET name = $1, description = $2 WHERE id = $3', [name, description,id])
                res.status(200).json({
                    msg: `Se ha actualizo la categoria`
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

const changeStatusCategory = async (req, res) => {
    try {
        const { id, removed } = req.body;
        if(id == ""){
            return res.status(400).json({
                msg: "Debe especificar el id de la categoria para removerlo"
            })
        } else {
            const categories = await connection.query("Select * from category where id = $1",[id]);
            if(categories.rows.length === 0){
                return res.status(200).json({
                    msg: "El proveedor no existe"
                });
            } else {
                const categories1 = await connection.query('UPDATE category SET removed = $1 WHERE id = $2', [removed, id])
                res.status(200).json({
                    msg: `Se actualizo el estado de la categoria con id: ${id}`
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}

module.exports = {
    getCategory,
    createCategory,
    searchcategory,
    modifycategory,
    changeStatusCategory
}
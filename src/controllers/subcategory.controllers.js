const connection = require('../config/db');
const functions = require('../helpers/functionshelper')
const subCategoryFunctions = {}

subCategoryFunctions.getSubCategory = async (req, res) => { //Se obtienen todas las subcategorias
    try {
        let get_subcategory = 'SELECT * FROM subcategory'
        const subcategory = await connection.query(get_subcategory);
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


subCategoryFunctions.createSubCategory = async (req, res) => { //Crear una subcategoria
    try {
        const { name, description, id_category } = req.body;
        const removed = false;
        if (name == "" || id_category == "") {
            return res.status(401).json({
                msg: "La subcategoria debe incluir nombre e id de categoria."
            });
        } else {
            let get_subcategory_id = 'SELECT * FROM category where id = $1'
            const category = await connection.query(get_subcategory_id, [id_category]) //Se busca la subcategoria por id
            if (category.rows.length === 0) {
                return res.status(200).json({
                    msg: "No existe la categoria"
                })
            }
            let insert_subcategory = 'INSERT INTO subcategory(name,description,removed,id_category) VALUES($1,$2,$3,$4)'
            const subcategory = await connection.query(insert_subcategory, [name, description, removed, id_category]) //Se ingresa la subcategoria
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

subCategoryFunctions.searchsubcategory = async (req, res) => { //Se busca subcategoria por el nombre
    try {
        const { name } = req.body;
        nameCapitalize = functions.capitalizarPrimeraLetra(name)
        let search_subcategory = `SELECT * FROM subcategory where name LIKE '${nameCapitalize}%'` //Se busca la subcategoria por coincidencia
        const categories = await connection.query(search_subcategory);
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

subCategoryFunctions.modifysubcategory = async (req, res) => { //Se modifican los campos de la subcategoria
    try {
        const { id, name, description } = req.body;
        if (id == "" || name == "" || description == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            });
        } else {
            let get_subcategory_id = "Select * from subcategory where id = $1"
            const categories = await connection.query( get_subcategory_id, [id]) //Se busca la subcategoria por id
            if (categories.rows.length === 0) {
                return res.status(200).json({
                    msg: "La subcategoria no existe"
                });
            } else {
                let update_subcategory = 'UPDATE subcategory SET name = $1, description = $2 WHERE id = $3'
                const categories1 = await connection.query( update_subcategory, [name, description, id]) //Se actualizan los campos de la subcategoria
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

subCategoryFunctions.changeStatussubCategory = async (req, res) => { //Cambio del estado removido de subcategoria
    try {
        const { id, removed } = req.body;
        if (id == "") {
            return res.status(400).json({
                msg: "Debe especificar el id de la categoria para removerlo"
            })
        } else {
            let get_subcategory = "Select * from subcategory where id = $1"
            const subcategories = await connection.query( get_subcategory, [id]); //Se busca subcategoria por id
            if (subcategories.rows.length === 0) {
                return res.status(200).json({
                    msg: "La subcategoria no existe"
                });
            } else {
                let update_subcategory = 'UPDATE subcategory SET removed = $1 WHERE id = $2'
                const subcategories1 = await connection.query( update_subcategory, [removed, id]) //Se actualiza el estado de la subcategoria
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
module.exports = subCategoryFunctions
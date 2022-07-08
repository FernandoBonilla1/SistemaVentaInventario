const connection = require('../config/db');
const functions = require('../helpers/functionshelper')
const categoryFunctions = {}

categoryFunctions.getCategory = async (req, res) => {
    try {
        let get_category = 'SELECT * FROM category'
        const category = await connection.query(get_category);
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

categoryFunctions.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const removed = false;
        if (name == "") {
            return res.status(401).json({
                msg: "La categoria debe incluir nombre."
            });
        } else {
            let insert_category = 'INSERT INTO category(name,description,removed) VALUES($1,$2,$3)'
            const category = await connection.query( insert_category, [name, description, removed])
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

categoryFunctions.searchcategory = async (req, res) => {
    try {
        const { name } = req.body;
        nameCapitalize = name.toUpperCase()
        let search_category = `SELECT * FROM category where name LIKE '${nameCapitalize}%'`
        const categories = await connection.query( search_category);
        if (categories.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay categorias"
            });
        }
        res.status(200).json(categories.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla category",
            error
        })
    }
}

categoryFunctions.modifycategory = async (req, res) => {
    try {
        const { id, name, description } = req.body;
        if (id == "" || name == "" || description == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            });
        } else {
            let get_category = "Select * from category where id = $1"
            const categories = await connection.query( get_category, [id])
            if (categories.rows.length === 0) {
                return res.status(200).json({
                    msg: "La categoria no existe"
                });
            } else {
                let update_category = 'UPDATE category SET name = $1, description = $2 WHERE id = $3'
                const categories1 = await connection.query( update_category, [name, description, id])
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

categoryFunctions.changeStatusCategory = async (req, res) => {
    try {
        const { id, removed } = req.body;
        if (id == "") {
            return res.status(400).json({
                msg: "Debe especificar el id de la categoria para removerlo"
            })
        } else {
            let get_category = "Select * from category where id = $1"
            const categories = await connection.query( get_category, [id]);
            if (categories.rows.length === 0) {
                return res.status(200).json({
                    msg: "La categoria no existe"
                });
            } else {
                let update_category = 'UPDATE category SET removed = $1 WHERE id = $2'
                const categories1 = await connection.query( update_category, [removed, id])
                if(removed){
                    let update_subcategory = "UPDATE subcategory SET removed = $1 where id_category = $2"
                    const subcategorys = await connection.query( update_subcategory,[removed, id])
                    return res.status(200).json({
                        msg: `Se actualizo el estado de la categoria con id: ${id}`
                    });
                }else{
                    let update_subcategory = "UPDATE subcategory SET removed = $1 where id_category = $2"
                    const subcategorys = await connection.query( update_subcategory,[removed, id])
                    return res.status(200).json({
                        msg: `Se actualizo el estado de la categoria con id: ${id}`
                    });
                }
                
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla category",
            error
        })
    }
}

module.exports = categoryFunctions
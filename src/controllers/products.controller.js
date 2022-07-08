const connection = require('../config/db');
const functions = require('../helpers/functionshelper')
const productFunctions = {};

productFunctions.getProductwithStockMin = async (req, res) => {
    try {
        let get_product = 'select product.id, product.name, product.description, product.amount, product.value, product.id_subcategory as subcategory, subcategory.id_category as category, product.url, product.stockmin as stockmin from product INNER join subcategory on (product.id_subcategory = subcategory.id) where (product.amount <= product.stockmin) '
        const product = await connection.query(get_product);
        if (product.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay productos con stockmin"
            })
        }
        res.status(200).json(product.rows)
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}



productFunctions.getRandomProducts = async (req, res) => {
    try {
        let get_product = 'select product.id, product.name, product.description, product.amount, product.value, product.id_subcategory as subcategory, subcategory.id_category as category, product.url  from product INNER join subcategory on (product.id_subcategory = subcategory.id) order by random() limit 6'
        const product = await connection.query(get_product);
        if (product.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay productos"
            })
        }
        res.status(200).json(product.rows)
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}

productFunctions.getRandomProductCategory = async (req, res) => {
    try {
        const { id_category } = req.body
        let get_product = 'select product.id, product.name, product.description, product.amount, product.value, product.id_subcategory as subcategory, subcategory.id_category as category, product.url  from product INNER join subcategory on (product.id_subcategory = subcategory.id) where subcategory.id_category = $1 order by random() limit 4'
        const product = await connection.query( get_product, [id_category]);
        if (product.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay productos"
            })
        }
        res.status(200).json(product.rows)
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}

productFunctions.getProducts = async (req, res) => {
    try {
        let get_product = 'SELECT product.id, product.name, product.year, product.brand, product.description, product.amount, product.stockmin, product.value, product.removed, product.url, category.id as id_category, subcategory.id as id_subcategory FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category)'
        const products = await connection.query( get_product);
        if (products.rows.length === 0) {
            res.status(200).json({
                msg: "No hay productos"
            })
        }
        res.status(200).json(products.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la lista de productos",
            error
        })
    }

}


productFunctions.getProductwithcategorys = async (req, res) => {
    try {
        const { id_category, id_subcategory } = req.body;
        if (id_category == undefined && id_subcategory == undefined) {
            let get_product = 'SELECT * FROM product'
            const products1 = await connection.query(get_product);
            if (products1.rows.length === 0) {
                return res.status(200).json({
                    msg: "No hay productos"
                })
            }
            return res.status(200).json(products1.rows);
        } else {
            if (id_subcategory == undefined) {
                let get_product1 = 'SELECT product.id, product.name, product.year, product.brand, product.description, product.amount, product.stockmin, product.value, product.removed, product.url, category.id as id_category, subcategory.id as id_subcategory FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category) Where category.id = $1'
                const products1 = await connection.query( get_product1, [id_category])
                if (products1.rows.length === 0) {
                    return res.status(200).json({
                        msg: "No hay productos"
                    })
                }
                return res.status(200).json(products1.rows);
            } else {
                if (id_category == undefined) {
                    let get_product2 = 'SELECT product.id, product.name, product.year, product.brand, product.description, product.amount, product.stockmin, product.value, product.removed, product.url, category.id as id_category, subcategory.id as id_subcategory FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category) Where subcategory.id = $1'
                    const products1 = await connection.query( get_product2, [id_subcategory])
                    if (products1.rows.length === 0) {
                        return res.status(200).json({
                            msg: "No hay productos"
                        })
                    }
                    return res.status(200).json(products1.rows);
                } else {
                    let get_product3 = 'SELECT product.id, product.name, product.year, product.brand, product.description, product.amount, product.stockmin, product.value, product.removed, product.url, category.id as id_category, subcategory.id as id_subcategory FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category) Where category.id = $1 and subcategory.id = $2'
                    const products = await connection.query( get_product3, [id_category, id_subcategory])
                    if (products.rows.length === 0) {
                        return res.status(200).json({
                            msg: "No hay productos"
                        })
                    }
                    res.status(200).json(products.rows);
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}

productFunctions.selectProduct = async (req, res) => {
    try {
        const { id_product, id_category, id_subcategory } = req.body;
        let get_select_product = 'SELECT product.id, product.name, product.year, product.brand, product.description, product.amount, product.stockmin, product.value, product.removed, product.url, category.id as idcategory, subcategory.id as idsubcategory FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category) Where product.id = $1 and category.id = $2 and subcategory.id = $3'
        const products1 = await connection.query( get_select_product, [id_product, id_category, id_subcategory])
        if (products1.rows.length === 0) {
            return res.status(200).json({
                msg: "No hay productos"
            })
        }
        return res.status(200).json(products1.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}

productFunctions.searchProduct = async (req, res) => {
    try {
        const { name } = req.body;
        nameCapitalize = functions.capitalizarPrimeraLetra(name);
        let search_product = `SELECT product.id, product.name, product.year, product.brand, product.description, product.amount, product.stockmin, product.value, product.removed, product.url, category.id as id_category, subcategory.id as id_subcategory FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category) WHERE product.name LIKE '${nameCapitalize}%'`
        const products = await connection.query( search_product);
        if (products.rows.length === 0) {
            return res.status(200).json({
                msg: "El producto no existe."
            });
        }
        res.status(200).json(products.rows);
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }

}

productFunctions.createProduct = async (req, res) => {
    try {
        const { name, year, brand, description, amount, stockmin, value, id_subcategory, id_supplier } = req.body;
        const removed = false;
        if (name == "" || brand == "" || id_subcategory == "" || id_supplier == "" || year == "" || amount == "" || stockmin == "" || value == "") {
            return res.status(400).json({
                msg: "El producto debe incluir todos los campos"
            });
        } else {
            if (amount < 0 || stockmin < 0 || value < 0 || year < 0) {
                return res.status(400).json({
                    msg: "No puede ingresar valores negativos."
                });
            } else {
                let insert_product = 'INSERT INTO product(name,year,brand,description,amount,stockmin,value,id_subcategory,id_supplier,removed) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)'
                const product = await connection.query( insert_product, [name, year, brand, description, amount, stockmin, value, id_subcategory, id_supplier, removed])
                res.status(200).json({
                    msg: `Se logro crear el producto con nombre: ${name}`
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo agregar el producto a la tabla",
            error
        })
    }
}

productFunctions.changeStock = async (req, res) => {
    try {
        const { id, amount } = req.body;
        if (id == undefined || amount == undefined) {
            return res.status(401).json({
                msg: "Debe incluir el campo id y cantidad del producto."
            })
        } else {
            if (id == "" || amount == "") {
                return res.status(401).json({
                    msg: "Debe rellenar los campos."
                })
            } else {
                if (amount < 0) {
                    return res.status(401).json({
                        msg: "No puede ingresar stock menor a cero."
                    })
                } else {
                    let update_product = 'UPDATE product SET amount = $1 WHERE id = $2'
                    const product = await connection.query( update_product, [amount, id])
                    res.status(200).json({
                        msg: `Se actualizo la cantidad al producto con id: ${id}`
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}

productFunctions.modifyProduct = async (req, res) => {
    try {
        const { id, name, year, brand, description, amount, value, stockmin } = req.body;
        if (id == "" || name == "" || year == "" || brand == "" || amount == "" || value == "" || stockmin == "") {
            return res.status(400).json({
                msg: "Debe rellenar los campos."
            });
        } else {
            if (amount < 0 || stockmin < 0 || value < 0 || year < 0) {
                return res.status(400).json({
                    msg: "No puede ingresar estos valores."
                })
            } else {
                let get_product_id = "Select * from product where id = $1"
                const product1 = await connection.query( get_product_id, [id])
                if (product1.rows.length === 0) {
                    return res.status(200).json({
                        msg: "El producto no existe"
                    });
                } else {
                    let update_product = 'UPDATE product SET year = $1, brand = $2, description = $3, amount = $4, value = $5, name = $6, stockmin = $7 WHERE id = $8'
                    const product = await connection.query( update_product, [year, brand, description, amount, value, name, stockmin, id])
                    res.status(200).json({
                        msg: `Se ha actualizo el producto`
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }
}

productFunctions.deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (id == "") {
            return res.status(200).json({
                msg: "Debe especificar el producto"
            })
        } else {
            let get_product = "Select * from product where id = $1"
            const product1 = await connection.query( get_product, [id])
            if (product1.rows.length === 0) {
                return res.status(200).json({
                    msg: "No existe el producto"
                });
            } else {
                let delete_product = 'DELETE FROM product WHERE id = $1'
                const product2 = await connection.query( delete_product, [id]);
                res.status(200).json({
                    msg: `Se elimino el producto con id: ${id}`
                })
            }
        }
    } catch (error) {
        res.status(401).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        });
    }
};



productFunctions.changeStatus = async (req, res) => {
    try {
        const { id, removed } = req.body;
        if (id == "") {
            return res.status(400).json({
                msg: "Debe especificar el producto para removerlo"
            })
        } else {
            let get_product_id = "Select * from product where id = $1"
            const product1 = await connection.query( get_product_id, [id]);
            if (product1.rows.length === 0) {
                return res.status(200).json({
                    msg: "El producto no existe"
                });
            } else {
                let update_product = 'UPDATE product SET removed = $1 WHERE id = $2'
                const product = await connection.query( update_product, [removed, id])
                res.status(200).json({
                    msg: `Se actualizo el estado del producto con id: ${id}`
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
module.exports = productFunctions
const connection = require('../config/db');


function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const getCategory = async (req, res) => {
    try {
        const category = await connection.query('SELECT * FROM category');
        if (category.rows.length === 0) {
            res.status(401).json({
                msg: "No hay categorias"
            })
        }
        res.status(200).json({ categorys: category.rows });
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

const getSubCategory = async (req, res) => {
    try {
        const subcategory = await connection.query('SELECT * FROM subcategory');
        if (subcategory.rows.length === 0) {
            res.status(401).json({
                msg: "No hay subcategorias"
            })
        }
        res.status(200).json({ subcategorys: subcategory.rows });
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla subcategory",
            error
        })
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await connection.query('SELECT * FROM product');
        if (products.rows.length === 0) {
            res.status(401).json({
                msg: "No hay productos"
            })
        }
        res.status(200).json({ products: products.rows });
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la lista de productos",
            error
        })
    }

}

const getProductwithcategorys = async (req, res) => {
    try {
        const { id_category, id_subcategory } = req.body;
        if (id_category == undefined && id_subcategory == undefined) {
            const products1 = await connection.query('SELECT * FROM product');
            if (products1.rows.length === 0) {
                return res.status(200).json({
                    msg: "No hay productos"
                })
            }
            return res.status(200).json({ products: products1.rows });
        } else {
            if (id_subcategory == undefined) {
                const products1 = await connection.query('SELECT product.id, product.name, product.brand, product.description, product.amount, product.stockmin, product.value, product.removed, product.url FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category) Where category.id = $1', [id_category])
                if (products1.rows.length === 0) {
                    return res.status(200).json({
                        msg: "No hay productos"
                    })
                }
                return res.status(200).json({ products: products1.rows });
            } else {
                if (id_category == undefined) {
                    const products1 = await connection.query('SELECT product.id, product.name, product.brand, product.description, product.amount, product.stockmin, product.value, product.removed, product.url FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category) Where subcategory.id = $1', [id_subcategory])
                    if (products1.rows.length === 0) {
                        return res.status(200).json({
                            msg: "No hay productos"
                        })
                    }
                    return res.status(200).json({ products: products1.rows });
                } else {
                    const products = await connection.query('SELECT product.id, product.name, product.brand, product.description, product.amount, product.stockmin, product.value, product.removed, product.url FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category) Where category.id = $1 and subcategory.id = $2', [id_category, id_subcategory])
                    if (products.rows.length === 0) {
                        return res.status(200).json({
                            msg: "No hay productos"
                        })
                    }
                    res.status(200).json({ products: products.rows });
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

const searchProduct = async (req, res) => {
    try {
        const { name } = req.body;
        if (name == undefined) {
            return res.status(401).json({
                msg: "Debe incluir todos los campos."
            });
        } else {
            nameCapitalize = capitalizarPrimeraLetra(name);
            const products = await connection.query(`SELECT * FROM product WHERE name LIKE '${nameCapitalize}%'`);
            if (products.rows.length === 0) {
                return res.status(401).json({
                    msg: "El producto no existe."
                });
            }
            res.status(200).json({ products: products.rows });
        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo acceder a la tabla producto",
            error
        })
    }

}

const createProduct = async (req, res) => {
    try {
        const { name, year, brand, description, amount, stockmin, value, id_subcategory, id_supplier } = req.body;
        const removed = false;
        if (name == undefined || year == undefined || brand == undefined || amount == undefined || stockmin == undefined || value == undefined || id_subcategory == undefined || id_supplier == undefined) {
            return res.status(400).json({
                msg: "Debe incluir todos los campos."
            });
        } else {
            if (name == "" || brand == "" || id_subcategory == "" || id_supplier == "" || year == "" || amount == "" || stockmin == "" || value == "") {
                return res.status(400).json({
                    msg: "El producto debe incluir todos los campos"
                });
            } else {
                if (amount < 0 || stockmin < 0 || value < 0 || year < 0) {
                    return res.status(400).json({
                        msg: "No puede ingresar estos valores."
                    });
                } else {
                    const product = await connection.query('INSERT INTO product(name,year,brand,description,amount,stockmin,value,id_subcategory,id_supplier,removed) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [name, year, brand, description, amount, stockmin, value, id_subcategory, id_supplier, removed])
                    res.status(200).json({
                        msg: `Se logro crear el producto con nombre: ${name}`
                    });
                }
            }

        }
    } catch (error) {
        res.status(500).json({
            msg: "No se pudo agregar el producto a la tabla",
            error
        })
    }
}

const changeStock = async (req, res) => {
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
                    const product = await connection.query('UPDATE product SET amount = $1 WHERE id = $2', [amount, id])
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

const modifyProduct = async (req, res) => {
    try {
        const { id, name, year, brand, description, amount, value, stockmin } = req.body;
        if (id == undefined || year == undefined || brand == undefined || amount == undefined || stockmin == undefined || value == undefined || name == undefined) {
            return res.status(400).json({
                msg: "Debe incluir todos los campos."
            });
        } else {
            if (id == "" || name == "" || year == "" || brand == "" || amount == "" || value == "" || stockmin == "") {
                return res.status(400).json({
                    msg: "Debe rellenar los campos."
                })
            } else {
                if (amount < 0 || stockmin < 0 || value < 0 || year < 0) {
                    return res.status(400).json({
                        msg: "No puede ingresar estos valores."
                    });
                } else {
                    const product = await connection.query('UPDATE product SET year = $1, brand = $2, description = $3, amount = $4, value = $5, name = $6, stockmin = $7 WHERE id = $8', [year, brand, description, amount, value, name, stockmin, id])
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

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (id == undefined) {
            return res.status(400).json({
                msg: "Debe incluir todos los campos."
            });
        } else {
            if (id == "") {
                return res.status(400).json({
                    msg: "Debe especificar el producto"
                })
            } else {
                const product = await connection.query('DELETE FROM product WHERE id = $1', [id]);
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



const changeStatus = async (req, res) => {
    try {
        const { id, removed } = req.body;
        if (id == undefined || removed == undefined) {
            return res.status(400).json({
                msg: "Debe incluir todos los campos."
            });
        } else {
            if (id == "") {
                return res.status(400).json({
                    msg: "Debe especificar el producto para removerlo"
                })
            } else {
                const product = await connection.query('UPDATE product SET removed = $1 WHERE id = $2', [removed, id])
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




module.exports = {
    getProducts,
    searchProduct,
    createProduct,
    changeStock,
    changeStatus,
    modifyProduct,
    deleteProduct,
    getCategory,
    getSubCategory,
    getProductwithcategorys,
    createCategory,
    createSubCategory
}
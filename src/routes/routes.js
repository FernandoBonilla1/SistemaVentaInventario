const { Router } = require('express');
const router = Router();

const {authenticateToken} = require("../middleware/authorization")

//Rutas designadas a los usuarios
const {getUsers, createUsers, getUserById, deleteUser, updateUser} = require('../controllers/user.controllers');

router.get('/users', getUsers);
router.get('/searchuser', getUserById);
router.post('/createuser', createUsers);
router.put('/updateuser', updateUser);
router.delete('/deleteuser', deleteUser);

//Rutas designadas a los productos

const {getProducts, searchProduct, createProduct, changeStock, changeStatus} = require('../controllers/products.controller');

router.get('/products', getProducts);
router.get('/searchproduct', searchProduct);
router.post('/addproduct', createProduct);
router.put('/updatestock', changeStock);
router.put('/updatestatusproduct', changeStatus);

//Rutas designadas a proveedores
const {getSuppliers, createSupplier} = require('../controllers/suppliers.controllers');

router.get('/suppliers', getSuppliers);
router.post('/addsupplier', createSupplier);

//Rutas designadas a ventas

const {getSale} = require('../controllers/sales.controllers');

router.get('/sales',getSale);

module.exports = router;
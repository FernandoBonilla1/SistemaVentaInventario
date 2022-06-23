const { Router } = require('express');
const router = Router();

const {authenticateToken} = require("../middleware/authorization")

//Rutas designadas a los usuarios
const {getUsers, createUsers, getUserById, deleteUser, updateUser} = require('../controllers/user.controllers');

router.get('/users', getUsers);
router.post('/searchuser', getUserById);
router.post('/createuser', createUsers);
router.put('/updateuser', updateUser);
router.delete('/deleteuser', deleteUser);

//Rutas designadas a los productos

const {getProducts, searchProduct, createProduct, changeStock, changeStatus, modifyProduct, deleteProduct, getCategory, getSubCategory, getProductwithcategorys, createCategory, createSubCategory, selectProduct} = require('../controllers/products.controller');

router.get('/products', getProducts);
router.post('/searchproduct', searchProduct);
router.post('/addproduct', createProduct);
router.put('/updatestock', changeStock);
router.put('/updatestatusproduct', changeStatus);
router.put('/modifyproduct', modifyProduct);
router.delete('/deleteproduct', deleteProduct);
router.get('/category', getCategory);
router.get('/subcategory', getSubCategory);
router.post('/productcategory', getProductwithcategorys);
router.post('/createcategory', createCategory);
router.post('/createsubcategory',createSubCategory);
router.post('/selectproduct', selectProduct);
//Rutas designadas a productos defectuosos

const {getDefectiveProduct, createDefectiveProduct} = require('../controllers/defective_product.controllers')

router.get('/defectiveproduct', getDefectiveProduct);
router.post('/adddefectiveproduct', createDefectiveProduct);

//Rutas designadas a proveedores
const {getSuppliers, createSupplier} = require('../controllers/suppliers.controllers');

router.get('/suppliers', getSuppliers);
router.post('/addsupplier', createSupplier);

//Rutas designadas a reportes

const {reporteExistecia} = require('../controllers/reportes.controllers');
router.get('/get-reporte-existencia',reporteExistecia);

//Rutas designada para productos deseados
const {getWantedCart,addProductWantedCart,ModifyWantedCart,deleteProductWantedCart} = require('../controllers/wantedcart.controllers')

router.post('/getwantedcart',getWantedCart);
router.post('/addproductwantedcart',addProductWantedCart);
router.post('/modifyproductwantedcart',ModifyWantedCart);
router.post('/deleteproductwantedcart',deleteProductWantedCart);
//Rutas designadas a ventas

const {getSale} = require('../controllers/sales.controllers');

router.get('/sales',getSale);



module.exports = router;
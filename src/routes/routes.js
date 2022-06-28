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
router.post('/deleteproduct', deleteProduct);
router.get('/category', getCategory);
router.get('/subcategory', getSubCategory);
router.post('/productcategory', getProductwithcategorys);
router.post('/createcategory', createCategory);
router.post('/createsubcategory',createSubCategory);
router.post('/selectproduct', selectProduct);
//Rutas designadas a productos defectuosos

const {getDefectiveProduct, createDefectiveProduct} = require('../controllers/defective_product.controllers')

router.post('/defectiveproduct', getDefectiveProduct);
router.post('/adddefectiveproduct', createDefectiveProduct);

//Rutas designadas a proveedores
const {getSuppliers, createSupplier} = require('../controllers/suppliers.controllers');

router.get('/suppliers', getSuppliers);
router.post('/addsupplier', createSupplier);

//Rutas designadas a reportes

const {reporteExistecia,boleta} = require('../controllers/reportes.controllers');
router.get('/get-reporte-existencia',reporteExistecia);
router.post('/get-boleta',boleta);

//Rutas designada para productos deseados
const {getWantedCart,addProductWantedCart,ModifyWantedCart,deleteProductWantedCart} = require('../controllers/wantedcart.controllers')

router.post('/getwantedcart',getWantedCart);
router.post('/addproductwantedcart',addProductWantedCart);
router.post('/modifyproductwantedcart',ModifyWantedCart);
router.post('/deleteproductwantedcart',deleteProductWantedCart);
//Rutas designadas a ventas

const {getSale,addSale,addProductToSale,confirmsale,removeProductToSale} = require('../controllers/sales.controllers');

router.post('/sales',getSale);
router.post('/addsale',addSale);
router.post('/addproductsale',addProductToSale);
router.post('/removeproductsale',removeProductToSale);
router.post('/confirmansale',confirmsale);



module.exports = router;
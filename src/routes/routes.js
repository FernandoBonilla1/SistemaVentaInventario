const { Router } = require('express');
const router = Router();
const fileUpload = require("express-fileupload");
const {authenticateToken} = require("../middleware/authorization")

//Rutas designadas a los usuarios
const {getUsers, createUsers, deleteUser, updateUser,searchUser} = require('../controllers/user.controllers');

router.get('/users', getUsers);
router.post('/createuser', createUsers);
router.put('/updateuser', updateUser);
router.delete('/deleteuser', deleteUser);
router.post('/searchuser',searchUser);

//Rutas designadas a los productos

const {getProducts, searchProduct, createProduct, changeStock, changeStatus, modifyProduct, deleteProduct, getProductwithcategorys, selectProduct, getRandomProductCategory,getRandomProducts, getProductwithStockMin} = require('../controllers/products.controller');

router.get('/products', getProducts);
router.post('/searchproduct', searchProduct);
router.post('/addproduct', createProduct);
router.put('/updatestock', changeStock);
router.put('/updatestatusproduct', changeStatus);
router.put('/modifyproduct', modifyProduct);
router.post('/deleteproduct', deleteProduct);
router.post('/productcategory', getProductwithcategorys);
router.post('/selectproduct', selectProduct);
router.post('/getrandomproductcategory',getRandomProductCategory);
router.get('/getrandomproduct',getRandomProducts);
router.get('/getproductstockmin', getProductwithStockMin);

//Rutas designadas a categorias

const {getCategory,createCategory, searchcategory, modifycategory, changeStatusCategory} = require("../controllers/category.controllers")
router.get('/category', getCategory);
router.post('/createcategory', createCategory);
router.post('/searchcategory',searchcategory);
router.post('/modifycategory', modifycategory);
router.post('/changestatuscategory', changeStatusCategory)
//Rutas designadas a subcategorias

const {getSubCategory,createSubCategory, searchsubcategory, modifysubcategory, changeStatussubCategory} = require("../controllers/subcategory.controllers")

router.get('/subcategory', getSubCategory);
router.post('/createsubcategory',createSubCategory);
router.post('/searchsubcategory', searchsubcategory);
router.post('/modifysubcategory', modifysubcategory);
router.post('/changestatussubcategory', changeStatussubCategory);

//Rutas designadas a productos defectuosos

const {getDefectiveProduct, createDefectiveProduct} = require('../controllers/defective_product.controllers')

router.post('/defectiveproduct', getDefectiveProduct);
router.post('/adddefectiveproduct', createDefectiveProduct);

//Rutas designadas a proveedores
const {getSuppliers, createSupplier, searchSupplier, deleteSupplier, modifysupplier, changeStatusSupplier} = require('../controllers/suppliers.controllers');

router.get('/suppliers', getSuppliers);
router.post('/addsupplier', createSupplier);
router.post('/searchsupplier',searchSupplier);
router.post('/deletesupplier',deleteSupplier);
router.post('/modifysupplier', modifysupplier);
router.post('/changestatussupplier',changeStatusSupplier)

//Rutas designadas a reportes

const {reporteExistecia,boleta} = require('../controllers/reportes.controllers');
router.get('/get-reporte-existencia',reporteExistecia);
router.post('/get-boleta',boleta);

//Rutas designada para productos deseados
const {getWantedCart,addProductWantedCart,ModifyWantedCart,deleteProductWantedCart,modifystateWantedCart} = require('../controllers/wantedcart.controllers')

router.post('/getwantedcart',getWantedCart);
router.post('/addproductwantedcart',addProductWantedCart);
router.post('/modifyproductwantedcart',ModifyWantedCart);
router.post('/deleteproductwantedcart',deleteProductWantedCart);
router.post('/modifystatewantedcart',modifystateWantedCart);
//Rutas designadas a ventas

const {getSale,addSale,addProductToSale,confirmsale,removeProductToSale, addSaleWantedCart, confirmsaleWantedCart, getpayment_method} = require('../controllers/sales.controllers');

router.post('/sales',getSale);
router.post('/addsale',addSale);
router.post('/addproductsale',addProductToSale);
router.post('/removeproductsale',removeProductToSale);
router.post('/confirmansale',confirmsale);
router.post('/addsalewantedcart',addSaleWantedCart);
router.post('/confirmsalewantedcart',confirmsaleWantedCart);
router.get('/getpaymentmethod', getpayment_method);

//Rutas Imagenes

const {getImageProductBase64, uploadImageProduct, changeurlProduct, changeurlCategory, uploadImageCategory} = require("../controllers/uploadimages.controller")
router.post('/getimageproduct',getImageProductBase64);
router.post('/uploadimageproduct',fileUpload(), uploadImageProduct);
router.get('/uploadimagecategory',uploadImageCategory);
router.get('/changeurlproduct',changeurlProduct);
router.get('/changeurlcategory',changeurlCategory);

module.exports = router;
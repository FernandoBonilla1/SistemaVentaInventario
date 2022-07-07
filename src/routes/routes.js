const { Router } = require('express');
const router = Router();
const userFunction = require('../controllers/user.controllers');
const productFunctions = require('../controllers/products.controller')
const categoryFunctions = require('../controllers/category.controllers')
const subCategoryFunctions = require('../controllers/subcategory.controllers')
const defective_productFunctions = require('../controllers/defective_product.controllers')
const supplierFunctions = require('../controllers/suppliers.controllers')
const reportFunctions = require('../controllers/reportes.controllers')
const wishCart = require('../controllers/wantedcart.controllers')
const salesFunctions = require('../controllers/sales.controllers')
const uploadImageFunction = require('../controllers/uploadimages.controller')

//Rutas designadas a los usuarios
router.get('/users', userFunction.getUsers);
router.put('/updateuser', userFunction.updateUser);
router.post('/searchuser',userFunction.searchUser);
router.post('/modifyuser', userFunction.modifyUser);
router.post('/modifyroleuser', userFunction.modifyRole);

//Rutas designadas a los productos
router.get('/products', productFunctions.getProducts);
router.post('/searchproduct', productFunctions.searchProduct);
router.post('/addproduct', productFunctions.createProduct);
router.put('/updatestock', productFunctions.changeStock);
router.put('/updatestatusproduct', productFunctions.changeStatus);
router.put('/modifyproduct', productFunctions.modifyProduct);
router.post('/deleteproduct', productFunctions.deleteProduct);
router.post('/productcategory', productFunctions.getProductwithcategorys);
router.post('/selectproduct', productFunctions.selectProduct);
router.post('/getrandomproductcategory',productFunctions.getRandomProductCategory);
router.get('/getrandomproduct',productFunctions.getRandomProducts);
router.get('/getproductstockmin', productFunctions.getProductwithStockMin);

//Rutas designadas a categorias
router.get('/category', categoryFunctions.getCategory);
router.post('/createcategory', categoryFunctions.createCategory);
router.post('/searchcategory',categoryFunctions.searchcategory);
router.post('/modifycategory', categoryFunctions.modifycategory);
router.post('/changestatuscategory', categoryFunctions.changeStatusCategory)

//Rutas designadas a subcategorias
router.get('/subcategory', subCategoryFunctions.getSubCategory);
router.post('/createsubcategory',subCategoryFunctions.createSubCategory);
router.post('/searchsubcategory', subCategoryFunctions.searchsubcategory);
router.post('/modifysubcategory', subCategoryFunctions.modifysubcategory);
router.post('/changestatussubcategory', subCategoryFunctions.changeStatussubCategory);

//Rutas designadas a productos defectuosos
router.post('/defectiveproduct', defective_productFunctions.getDefectiveProduct);
router.post('/adddefectiveproduct', defective_productFunctions.createDefectiveProduct);
router.post('/deletedefectiveproduct', defective_productFunctions.deleteDefectiveProduct);
router.post('/addreturnproduct',defective_productFunctions.create_Return_Product);
router.post('/getreturnproduct',defective_productFunctions.getreturn_Products);
router.post('/deletereturnproduct', defective_productFunctions.deleteReturnsProduct);

//Rutas designadas a proveedores
router.get('/suppliers', supplierFunctions.getSuppliers);
router.post('/addsupplier', supplierFunctions.createSupplier);
router.post('/searchsupplier', supplierFunctions.searchSupplier);
router.post('/deletesupplier', supplierFunctions.deleteSupplier);
router.post('/modifysupplier', supplierFunctions.modifysupplier);
router.post('/changestatussupplier', supplierFunctions.changeStatusSupplier)

//Rutas designadas a reportes
router.get('/get-reporte-existencia', reportFunctions.reporteExistecia);
router.post('/get-boleta', reportFunctions.boleta);
router.get('/get-reporte-defective-product', reportFunctions.reporte_productos_defectuosos);
router.get('/get-reporte-ventas-totales-por-precio',reportFunctions.reporte_ventas_totales_por_precio);
router.get('/get-reporte-ventas-totales-por-cantidad-vendida',reportFunctions.reporte_ventas_totales_por_cantidad_vendida)
router.get('/get-reporte-productos-devueltos',reportFunctions.reporte_de_productos_devueltos)

//Rutas designada para productos deseados
router.post('/getwantedcart', wishCart.getWantedCart);
router.post('/addproductwantedcart', wishCart.addProductWantedCart);
router.post('/modifyproductwantedcart', wishCart.ModifyWantedCart);
router.post('/deleteproductwantedcart', wishCart.deleteProductWantedCart);
router.post('/modifystatewantedcart', wishCart.modifystateWantedCart);

//Rutas designadas a ventas
router.post('/sales', salesFunctions.getSale);
router.post('/addsale', salesFunctions.addSale);
router.post('/addproductsale', salesFunctions.addProductToSale);
router.post('/removeproductsale', salesFunctions.removeProductToSale);
router.post('/confirmansale', salesFunctions.confirmsale);
router.post('/addsalewantedcart', salesFunctions.addSaleWantedCart);
router.get('/getpaymentmethod', salesFunctions.getpayment_method);
router.get('/deleterecordsoftwoyears', salesFunctions.deleteRecordsOfTwoYears)

//Rutas Imagenes
router.post('/getimageproduct', uploadImageFunction.getImageProductBase64);
router.post('/uploadimageproduct', uploadImageFunction.uploadImageProduct);
router.post('/uploadimagecategory', uploadImageFunction.uploadImageCategory);
router.get('/changeurlproduct', uploadImageFunction.changeurlProduct);
router.get('/changeurlcategory', uploadImageFunction.changeurlCategory);

module.exports = router;
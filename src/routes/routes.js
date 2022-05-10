const { Router } = require('express');
const router = Router();

const {authenticateToken} = require("../middleware/authorization")

//Rutas designadas a los usuarios
const {getUsers, createUsers, getUserById, deleteUser, updateUser} = require('../controllers/user.controllers');

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUsers);
router.put('/users/:rut', updateUser);
router.delete('/users/:rut', deleteUser);

//Rutas designadas a los productos



module.exports = router;
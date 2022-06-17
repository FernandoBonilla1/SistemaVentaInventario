
const { Router } = require('express');
const { rotate } = require('pdfkit');
const router = Router();

const {register, login, logout, loginFuncionario, registerFuncionario} = require("../controllers/auth.controller");


router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/loginstaff', loginFuncionario);

router.post('/registerstaff', registerFuncionario);

module.exports = router;
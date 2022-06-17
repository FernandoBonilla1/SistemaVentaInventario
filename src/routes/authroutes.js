
const { Router } = require('express');
const router = Router();

const {register, login, logout, loginFuncionario} = require("../controllers/auth.controller");


router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/loginstaff', loginFuncionario);

module.exports = router;
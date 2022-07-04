
const { Router } = require('express');
const router = Router();

const authFunctions = require('../controllers/auth.controller')

router.post('/register', authFunctions.register);
router.post('/login', authFunctions.login);
router.post('/loginstaff', authFunctions.loginFuncionario);
router.post('/registerstaff', authFunctions.registerFuncionario);
router.post('/forgot-password', authFunctions.forgotPassword);
router.post('/resetpassword', authFunctions.resetPassword);

module.exports = router;
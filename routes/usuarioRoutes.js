const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioControllers');

router.post('/cadastro', usuarioController.cadastrarUsuario);

module.exports = router;
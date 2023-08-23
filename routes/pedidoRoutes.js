const express = require('express');
const passport = require('passport'); // Importa o Passport
const router = express.Router();

const pedidoController = require('../controllers/pedidoControllers');

router.post('/', passport.authenticate('jwt', { session: false }), pedidoController.createPedido);
router.put('/:id', passport.authenticate('jwt', { session: false }), pedidoController.changeStatusPedido);
router.put('/:id/jogos', passport.authenticate('jwt', { session: false }), pedidoController.addJogoToPedido);
router.get('/', passport.authenticate('jwt', { session: false }), pedidoController.getUserPedidos);
router.delete('/:pedidoId/usuario/:usuarioId/jogos/:jogoId', passport.authenticate('jwt', { session: false }), pedidoController.deleteJogo);

module.exports = router;

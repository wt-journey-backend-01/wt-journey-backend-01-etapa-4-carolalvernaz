const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas protegidas por autenticação
router.get('/', authMiddleware, usuariosController.getAll);
router.get('/:id', authMiddleware, usuariosController.getById);
router.post('/', authMiddleware, usuariosController.create);
router.put('/:id', authMiddleware, usuariosController.update);
router.patch('/:id', authMiddleware, usuariosController.partialUpdate);
router.delete('/:id', authMiddleware, usuariosController.remove);

module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/casosController');
const authMiddleware = require('../middlewares/authMiddleware');

// aplica o middleware em todas as rotas de casos
router.use(authMiddleware);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.partialUpdate);
router.delete('/:id', controller.remove);

module.exports = router;

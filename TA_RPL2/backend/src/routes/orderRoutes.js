const express = require('express');
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticateToken, orderController.placeOrder);
router.get('/', authenticateToken, orderController.getOrders);
router.get('/allorder', authenticateToken, orderController.getAllOrder);
router.get('/:id', authenticateToken, orderController.getOrderById);
router.put('/:id', authenticateToken, orderController.updateOrder);
router.delete('/:id', authenticateToken, orderController.deleteOrder);

module.exports = router;
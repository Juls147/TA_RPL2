const express = require('express');
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticateToken, paymentController.createPayment);

module.exports = router;
const express = require('express');
const { fetchProvinces, fetchCities, fetchCost } = require('../rajaongkir/rajaOngkirController');
const router = express.Router();

router.get('/provinces', fetchProvinces);
router.get('/cities/:provinceId', fetchCities);
router.post('/cost', fetchCost);

module.exports = router;
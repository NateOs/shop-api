const express = require('express');
const router = express.Router();

const { getProductByField, getAllProductsStatic } = require('../controllers/products')

router.route('/').get(getProductByField)
router.route('/static').get(getAllProductsStatic)

module.exports = router
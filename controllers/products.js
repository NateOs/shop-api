const Products = require('../models/product')

const getAllProductsStatic = async (req, res) => {
	const allProducts = await Products.find({})
	res.status(200).json({allProducts, nbHits: allProducts.length})
}

const getAllProducts = async (req, res) => {
	res.status(200).json({msg: 'products route'})
}
 
module.exports = {
	getAllProducts, getAllProductsStatic
} 
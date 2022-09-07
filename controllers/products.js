const Products = require('../models/product')

const getAllProductsStatic = async (req, res) => {
	const allProducts = await Products.find({})
	res.status(200).json({allProducts, nbHits: allProducts.length})
}

const getProductByField = async (req, res) => {
	const { name, featured, company } = req.query

	const queryObject = {}
	
	if (name) {
		queryObject.name = {$regex: name, $options: 'i'}
	}

	if (featured) {
		queryObject.featured = featured === 'true' ? true : false
	}
	
	if (company) {
		queryObject.company = company
	}
	console.log(queryObject)

	const result = await Products.find( queryObject )
	
	res.status(200).json({result, nbHits: result.length})
}
 
module.exports = {
	getProductByField, getAllProductsStatic
} 
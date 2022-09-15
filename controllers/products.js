const Products = require('../models/product')

const getAllProductsStatic = async (req, res) => {
	const allProducts = await Products.find({}).sort('price')
	res.status(200).json({allProducts, nbHits: allProducts.length})
}

const getProductByField = async (req, res) => {
	const { name, featured, company, sort } = req.query

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

	let result = Products.find(queryObject)
	if (sort) { 
		const sortList = sort.split(',').join(' ');
	result = result.sort(sortList);
	}

	const products = await result
	
	res.status(200).json({nbHits: products.length, products })
} 
 
module.exports = {
	getProductByField, getAllProductsStatic
} 
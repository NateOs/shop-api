const Products = require('../models/product')

const getAllProductsStatic = async (req, res) => {
	const allProducts = await Products.find({}).sort('price')
	res.status(200).json({allProducts, nbHits: allProducts.length})
}

const getProductByField = async (req, res) => {
	// depending on what property values are passed, we process them
	const { name, featured, company, sort, fields,  } = req.query

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
	// sorting results by property or properties
	if (sort) { 
		const sortList = sort.split(',').join(' ');
		result = result.sort(sortList);
	} else {
		result = result.sort('createdAt')
	}

	// choose what fields to display as results
	if (fields) {
		const fieldsList = fields.split(',').join(' ')
		result = result.select(fieldsList)
	} 

	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (page - 1) * limit

	result = result.skip(skip).limit(limit)

	const products = await result
	
	res.status(200).json({nbHits: products.length, products })
} 
 
module.exports = {
	getProductByField, getAllProductsStatic
}
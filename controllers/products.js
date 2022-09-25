const Products = require('../models/product')

const getAllProductsStatic = async (req, res) => {
	const allProducts = await Products.find({}).sort('price')
	res.status(200).json({allProducts, nbHits: allProducts.length})
}

const getProductByField = async (req, res) => {
	// depending on what property values are passed, we process them
	const { name, featured, company, sort, fields,numericFilters  } = req.query

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
	// pagination
	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (page - 1) * limit

	result = result.skip(skip).limit(limit)

	// numeric filters  (greater than, less than or equal to)

	if (numericFilters) {
		const operatorMap = {
			'>': '$gt',
			'>=': '$gte',
			'=':'$eq',
			'<':'$lt',
			'<=':'$lte',
		}

		const regEx = /\b(<|>|>=|=|<|<=)\b/g
		let filters = numericFilters.replace(regEx,(match) => `-${operatorMap[match]}-`)
	console.log(filters)
		const options = [`price`, `rating`];
		filters = filters.split(',').forEach(item => {
			// array destructuring, values correspond to array indices
			// of 0, 1, 2 of(price - $gt - 40, rating - $gt - 4)

			const [field,operator,value] = item.split('-') 
			// assign to queryObject variable the values corresponding
			if (options.includes(field)) {
				queryObject[field] = {[operator]:Number(value)};
			}
		})
	 result = Products.find(queryObject)
	}

	
	const products = await result
	
	res.status(200).json({nbHits: products.length, products })
} 
 
module.exports = {
	getProductByField, getAllProductsStatic
}
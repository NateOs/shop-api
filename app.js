require('dotenv').config()
require('express-async-errors')
const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

// express instance
const express = require('express')
const app = express()

// middleware
app.use(express.json())

// routes
app.get('/', (req, res) => {
	res.send('<h1>Store API</h1><a href="/api/v1/products">Products</a>')
})

app.use('/api/v1/products', productsRouter)


const port = process.env.PORT || 3000

const start = async () => {
	try {
		await connectDB(process.env.M0NGO_URI).then(
			app.listen(port, console.log(`Server is listening on ${port}`) )
		)
	} catch (error) {
		console.log(error)
	}
}

// extra middleware
app.use(notFoundMiddleware)
app.use(errorMiddleware)
 
start()
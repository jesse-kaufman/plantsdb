// Server
import compression from 'compression'
import config from './config/config.js'
import connectDB from './config/db.js'
import cors from 'cors'
import errorHandler from 'errorhandler'
import express from 'express'
import logRoutes from './routes/logRoutes.js'
import plantRoutes from './routes/plantRoutes.js'

// MongoDB connection
connectDB()

// Setup Express
const app = express()

// Enable compression
app.use(compression())

// Interpret responses as JSON
app.use(express.json())

// Only parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

// Use CORS
app.use(cors())

// Setup Express error handlers for dev environment
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }))
}

// Setup Express error handlers for production environment
if (process.env.NODE_ENV === 'production') {
  app.use(errorHandler())
}

// Plant routes
app.use('/api/v1/plants', plantRoutes)

// Log routes
app.use('/api/v1/logs', logRoutes)

// Start the server
const server = app.listen(config.apiPort, () => {
  console.log(`Express running → PORT ${server.address().port}`)
})

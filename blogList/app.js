const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')
const logger = require('./utils/logger.js')
const config = require('./utils/config.js')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.mongoUrl)
mongoose.connect(config.mongoUrl)
    .then( () => {
        logger.info("MongoDB connection successful")
    })
    .catch( error => { logger.error(error.message) })
    
app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app
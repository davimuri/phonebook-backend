const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

// deprecation warnings https://mongoosejs.com/docs/deprecations.html
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/persons', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

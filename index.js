require('dotenv').config()

const express = require('express')
const app = express()
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors') //для запросов с браузера
app.use(cors())

const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const PORT = process.env.PORT

const rateLimit = require('express-rate-limit')
const csrf = require("csrf");
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to API calls only

app.use(express.json())
app.use('/api', router, apiLimiter)

app.use(errorHandler)

const xss = require('xss-clean');
app.use(xss())

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
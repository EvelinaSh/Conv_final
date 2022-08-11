require('dotenv').config()

const express = require('express')
const app = express()
const sequelize = require('./db')
const cors = require('cors') //для запросов с браузера
const xss = require('xss-clean')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const PORT = process.env.PORT || 5000
const path = require('path')

const rateLimit = require('express-rate-limit')
const csrf = require("csrf");
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to API calls only

app.use(cors())
app.use(express.json())
app.use('/api', router, apiLimiter)
app.use(errorHandler)
app.use(xss())
app.use(express.static(path.join(__dirname, './view/build')))

app.get('*', function(_, res) {
    res.sendFile(path.join(__dirname, './view/build/index.html'), function(err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    } catch (e) {
        console.log(e)
    }
}

start()
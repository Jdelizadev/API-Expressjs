
const LoggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toLocaleString()

    console.log([`${timestamp} ${req.url} ${req.method} - IP: ${req.ip}`])

    const start = Date.now()
    res.on('finish', () => {
        const duration = Date.now() - start 
        console.log(`[${timestamp}] Response: ${res.statusCode} - ${duration}ms`)
    })
    next()
}

module.exports = LoggerMiddleware
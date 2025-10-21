
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Ocurrió un error inesperado'

    console.log(`[Error] ${new Date().toLocaleString} - ${statusCode} - ${message}`)

    if(err.stack) {
        console.error(err.stack)
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack})
    })
}

//&& { stack: err.stack }: Este es un truco de JavaScript. Si la condición de la izquierda es true, el operador && devuelve la parte de la derecha. En este caso, devuelve un objeto { stack: err.stack }. Si la condición es false, devuelve false.

module.exports = errorHandler
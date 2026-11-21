const mongoose = require('mongoose')


module.exports = (req, res, next) => {
  const isConnected = mongoose.connection.readyState === 1

  if (isConnected) {
    return next()
  }

  res.status(503).json({
    message: 'Ma’lumotlar bazasiga ulanilmagan. Server terminalidagi MongoDB xatosini tekshiring.'
  })
}

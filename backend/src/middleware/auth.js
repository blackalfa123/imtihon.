const jwt = require('jsonwebtoken')
const JWT_SECRET = require('../config/jwt')


module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization
    const token = header?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Avval login qiling.' })
    }

    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.userId

    next()
  } catch {
    res.status(401).json({ message: 'Token yaroqsiz.' })
  }
}

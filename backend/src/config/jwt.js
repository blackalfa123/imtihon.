const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })


const secret = (process.env.JWT_SECRET || '').trim()
const isInvalid = !secret || /CHANGE_THIS|YOUR_SECRET|[<>]/.test(secret)

if (isInvalid) {
  console.error('JWT_SECRET: backend/.env ichiga uzun tasodifiy kalit yozing (kamida 16 belgi).')
  process.exit(1)
}


module.exports = secret

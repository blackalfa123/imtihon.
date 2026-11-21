const app = require('./app')
const connectDatabase = require('./config/database')

const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
  console.log(`Najot Talim: http://localhost:${PORT}`)
})


connectDatabase().catch((error) => {
  console.error('MongoDB ulanish xatosi:', error.message)
})

const path = require('path')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const auth = require('./middleware/auth')
const dbReady = require('./middleware/dbReady')

const app = express()


app.use(cors())
app.use(express.json())


const frontendPath = path.resolve(__dirname, '../../frontend')
app.use(express.static(frontendPath))


app.get('/api', (req, res) => {
  res.json({ message: 'Najot Talim API ishlayapti' })
})

app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1

  res.json({
    ok: true,
    db: isConnected ? 'connected' : 'disconnected'
  })
})


app.use('/api', (req, res, next) => {
  const isOpenRoute = req.path === '/' || req.path === '/health'

  if (isOpenRoute) {
    return next()
  }

  dbReady(req, res, next)
})


app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/users', auth, require('./routes/user.routes'))
app.use('/api/todos', auth, require('./routes/todo.routes'))
app.use('/api/posts', auth, require('./routes/post.routes'))


app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next()
  }

  res.sendFile(path.join(frontendPath, 'index.html'))
})


app.use((err, req, res, next) => {
  console.error(err.message)

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email band.' })
  }

  res.status(400).json({ message: err.message || 'Server xatosi.' })
})


module.exports = app

const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const JWT_SECRET = require('../config/jwt')
const auth = require('../middleware/auth')
const asyncHandler = require('../utils/asyncHandler')


function makeToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}


function publicUser(user) {
  return {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone
  }
}


function isFilled(value) {
  return typeof value === 'string' && value.trim() !== ''
}


router.post('/register', asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body

  if (!isFilled(firstname) || !isFilled(lastname) || !isFilled(email) || !isFilled(password)) {
    return res.status(400).json({ message: 'Ism, familiya, email va parol majburiy.' })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Parol kamida 6 ta belgidan iborat bo‘lsin.' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Email formati noto‘g‘ri.' })
  }

  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    return res.status(409).json({ message: 'Bu email allaqachon ro‘yxatdan o‘tgan.' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    email: normalizedEmail,
    password: hashedPassword
  })

  res.status(201).json({
    token: makeToken(user._id),
    user: publicUser(user)
  })
}))


router.post('/login', asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')

  if (!email || !password) {
    return res.status(400).json({ message: 'Email va parol majburiy.' })
  }

  const user = await User.findOne({ email }).select('+password')

  const wrongMessage = { message: 'Email yoki parol noto‘g‘ri.' }

  if (!user) {
    return res.status(401).json(wrongMessage)
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    return res.status(401).json(wrongMessage)
  }

  res.json({
    token: makeToken(user._id),
    user: publicUser(user)
  })
}))


router.get('/me', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)

  if (!user) {
    return res.status(404).json({ message: 'Foydalanuvchi topilmadi.' })
  }

  res.json(publicUser(user))
}))


module.exports = router

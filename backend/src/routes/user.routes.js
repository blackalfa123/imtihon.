const router = require('express').Router()
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')


function isFilled(value) {
  return typeof value === 'string' && value.trim() !== ''
}


router.post('/', asyncHandler(async (req, res) => {
  const { firstname, lastname, email, phone } = req.body

  if (!isFilled(firstname) || !isFilled(lastname) || !isFilled(email) || !isFilled(phone)) {
    return res.status(400).json({ message: 'Ism, familiya, email va telefon majburiy.' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Email formati noto‘g‘ri.' })
  }

  const temporaryPassword = crypto.randomBytes(24).toString('hex')
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10)

  const user = await User.create({
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password: hashedPassword
  })

  res.status(201).json({
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone
  })
}))


module.exports = router

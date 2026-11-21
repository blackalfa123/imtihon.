const router = require('express').Router()

const Post = require('../models/Post')
const asyncHandler = require('../utils/asyncHandler')


router.get('/', asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.userId }).sort({ createdAt: -1 })

  res.json(posts)
}))


router.post('/', asyncHandler(async (req, res) => {
  const { title, content } = req.body

  const isTitleValid = typeof title === 'string' && title.trim() !== ''
  const isContentValid = typeof content === 'string' && content.trim() !== ''

  if (!isTitleValid || !isContentValid) {
    return res.status(400).json({ message: 'Post sarlavhasi va matni majburiy.' })
  }

  const post = await Post.create({
    title: title.trim(),
    content: content.trim(),
    user: req.userId
  })

  res.status(201).json(post)
}))


module.exports = router

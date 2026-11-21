const router = require('express').Router()

const Todo = require('../models/Todo')
const asyncHandler = require('../utils/asyncHandler')


router.get('/', asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 })

  res.json(todos)
}))


router.post('/', asyncHandler(async (req, res) => {
  const { title, description, isCompleted } = req.body

  const isTitleValid = typeof title === 'string' && title.trim() !== ''
  const isDescriptionValid = typeof description === 'string' && description.trim() !== ''
  const isCompletedValid = typeof isCompleted === 'boolean'

  if (!isTitleValid || !isDescriptionValid || !isCompletedValid) {
    return res.status(400).json({ message: 'Sarlavha, tavsif va bajarilganlik holati majburiy.' })
  }

  const todo = await Todo.create({
    title: title.trim(),
    description: description.trim(),
    isCompleted,
    user: req.userId
  })

  res.status(201).json(todo)
}))


router.patch('/:id', asyncHandler(async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!todo) {
    return res.status(404).json({ message: 'Todo topilmadi.' })
  }

  res.json(todo)
}))


router.delete('/:id', asyncHandler(async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId })

  if (!todo) {
    return res.status(404).json({ message: 'Todo topilmadi.' })
  }

  res.json({ message: 'Todo o‘chirildi.' })
}))


module.exports = router

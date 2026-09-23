const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!request.user.id) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  const user = await User.findById(request.user.id)

  const blog = new Blog({ user: user._id, ...request.body })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!request.user.id) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === request.user.id.toString()) {
    await blog.deleteOne()
    return response.status(204).end()
  }

  response.status(403).json({ error: 'only creator can delete' })
})

blogsRouter.put('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title ?? blog.title
  blog.author = author ?? blog.author
  blog.url = url ?? blog.url
  blog.likes = likes ?? blog.likes

  const updatedBlog = await blog.save()
  return response.json(updatedBlog)
})

module.exports = blogsRouter
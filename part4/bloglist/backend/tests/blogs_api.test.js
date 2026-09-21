const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { initial } = require('lodash')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of blogs is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert.strictEqual(typeof blog.id, 'string')
    })
  })

  test('POST successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'Example',
      author: 'Firstname Lastname',
      url: 'google.com',
      likes: 5
    }

    const initialResponse = await api.get('/api/blogs')
    const newPost = new Blog(newBlog)
    await newPost.save()

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialResponse.body.length + 1)

    const titles = response.body.map(b => b.title)
    assert(titles.includes('Example'))
  })
})

after(async () => {
  await Blog.deleteMany({})
  await mongoose.connection.close()
})
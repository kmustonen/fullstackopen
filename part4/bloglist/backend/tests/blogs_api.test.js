const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

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

    const initialBlogs = await helper.blogsInDb()
    const newPost = new Blog(newBlog)
    await newPost.save()

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Example'))
  })

  test('likes defaults to 0', async () => {
    const newBlog = {
      title: 'Example',
      author: 'Firstname Lastname',
      url: 'google.com',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('returns 400 with missing url', async () => {
    const noUrlBlog = {
      title: 'This blog has no url',
      author: 'No Url'
    }

    await api
      .post('/api/blogs')
      .send(noUrlBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('returns 400 with missing title', async () => {
    const noUrlBlog = {
      url: 'notitle.com',
      author: 'No Title'
    }

    await api
      .post('/api/blogs')
      .send(noUrlBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

after(async () => {
  await Blog.deleteMany({})
  await mongoose.connection.close()
})
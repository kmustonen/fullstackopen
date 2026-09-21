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

  test('deleting a blog works', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(blog => blog.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('updating the likes of a blog works', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: blogToUpdate.likes + 1 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

    assert.deepStrictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('trying to update invalid id returns 400', async () => {
    const blogsAtStart = await helper.blogsInDb()

    await api
      .put('/api/blogs/invalidid')
      .send({ likes: 10 })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.deepStrictEqual(blogsAtStart, blogsAtEnd)
  })

  test('trying to update valid nonexisting id returns 404', async () => {
    const blogsAtStart = await helper.blogsInDb()
    var id = new mongoose.Types.ObjectId()

    await api
      .put(`/api/blogs/${id}`)
      .send({ likes: 10 })
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    assert.deepStrictEqual(blogsAtStart, blogsAtEnd)
  })
})

after(async () => {
  await Blog.deleteMany({})
  await mongoose.connection.close()
})
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('return the blog with max number of likes', () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    assert.deepStrictEqual(result.likes, 12)
  })

  const listWithNoBlogs = []

  test('return null when no blogs', () => {
    const result = listHelper.favoriteBlog(listWithNoBlogs)
    assert.strictEqual(result, null)
  })
})

describe('most blogs', () => {
  test('return author with most blogs', () => {
    const result = listHelper.mostBlogs(helper.initialBlogs)
    assert.deepStrictEqual(result.blogs, 3)
  })

  const listWithNoBlogs = []

  test('return null when no blogs', () => {
    const result = listHelper.mostBlogs(listWithNoBlogs)
    assert.strictEqual(result, null)
  })
})

describe('most likes', () => {
  test('return author with most likes', () => {
    const result = listHelper.mostLikes(helper.initialBlogs)
    assert.deepStrictEqual(result.likes, 17)
  })

  const listWithNoBlogs = []

  test('return null when no blogs', () => {
    const result = listHelper.mostLikes(listWithNoBlogs)
    assert.strictEqual(result, null)
  })
})
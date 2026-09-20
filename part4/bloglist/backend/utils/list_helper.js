const lodash = require('lodash')

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((prev, current) => prev.likes > current.likes ? prev : current);
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const counts = lodash.countBy(blogs, 'author')
    const author = lodash.maxBy(Object.keys(counts), (a) => counts[a])
    return { author: author, blogs: counts[author] }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const blogsPerAuthor = lodash.groupBy(blogs, 'author')
    const author = lodash.maxBy(Object.keys(blogsPerAuthor), (a) => totalLikes(blogsPerAuthor[a]))
    return { author: author, likes: totalLikes(blogsPerAuthor[author])}
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
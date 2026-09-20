const lodash = require('lodash')

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce(
  (prev, current) => {
    return prev.likes > current.likes ? prev : current
  }
  );
}

const mostBlogs = (blogs) => {
    const counts = lodash.countBy(blogs, 'author')
    const author = lodash.maxBy(Object.keys(counts), (a) => counts[a])
    return { author: author, blogs: counts[author] }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
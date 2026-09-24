import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = async event  => {
    event.preventDefault()

    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }

    createBlog(blogObject)
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <label>title: <input value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)} /></label>
      </div>
      <div>
        <label>author: <input value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)} /></label>
      </div>
      <div>
        <label>url: <input value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)} /></label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}
export default BlogForm
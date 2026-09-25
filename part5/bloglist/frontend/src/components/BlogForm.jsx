import { Typography, TextField, Button } from '@mui/material'
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
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>create new</Typography>
      <form onSubmit={addBlog}>
        <div><TextField label='title: ' value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)} style={{ marginTop: 10 }} variant="standard" /></div>
        <div><TextField label='author: ' value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)} style={{ marginTop: 10 }} variant="standard" /></div>
        <div><TextField label='url: ' value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)} style={{ marginTop: 10 }} variant="standard" /></div>

        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>create</Button>
      </form>
    </div>
  )
}
export default BlogForm
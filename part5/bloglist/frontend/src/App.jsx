import { Container, AppBar, Toolbar, Button, Typography, Box } from '@mui/material'
import { useState, useEffect } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'

import {
  Routes, Route, Link, Navigate, useMatch, useNavigate
} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const navigate = useNavigate()

  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState({
    message: null,
    status: null
  })
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (!loggedUserJSON) return null
    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    return user
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(function(a,b) {return b.likes - a.likes}) )
    )
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      return true
    } catch {
      setMessage({ message: 'wrong username or password', status: 'error' })
      setTimeout(() => {
        setMessage({ message: null, status: null })
      }, 5000)
      return false
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistappUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    if (!blogObject.title || !blogObject.url) {
      setMessage({ message: 'title and url are required', status: 'error' })
      setTimeout(() => {
        setMessage({ message: null, status: null })
      }, 5000)
      return
    }

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat({ ...returnedBlog, user }))
      setMessage({
        message: `a new blog ${blogObject.title} by ${blogObject.author} was added`,
        status: 'success'
      })
      setTimeout(() => {
        setMessage({ message: null, status: null })
      }, 5000)
      navigate('/')
    } catch {
      setMessage({ message: 'error in adding new blog', status: 'error' })
      setTimeout(() => {
        setMessage({ message: null, status: null })
      }, 5000)
    }
  }

  const handleLike = async (blogObject) => {
    blogObject = { ...blogObject, likes: blogObject.likes + 1 }
    await blogService.update(blogObject)

    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(function(a,b) {return b.likes - a.likes}) )
    )
  }

  const handleRemove = async (blogObject) => {
    if (window.confirm(`remove blog ${blogObject.title} by ${blogObject.author}`)) {
      await blogService.remove(blogObject)
      setMessage({
        message: `blog ${blogObject.title} by ${blogObject.author} was removed`,
        status: 'success'
      })
      setTimeout(() => {
        setMessage({ message: null, status: null })
      }, 5000)
      const updatedBlogs = await blogService.getAll()
      setBlogs( updatedBlogs.sort(function(a,b) {return b.likes - a.likes}))
      navigate('/')
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4">blog app</Typography>
          <div><Button color="inherit" component={Link} to="/" sx={style}>home</Button>
            {user && <Button color="inherit" component={Link} to="/create" sx={style}>new blog</Button>}
            {!user
              ? <Button color="inherit" component={Link} to="/login" sx={style}>login</Button>
              : <Button color="inherit" onClick={handleLogout} sx={style}>logout</Button>}
          </div>
        </Toolbar>
      </AppBar>
      <Notification message={message.message} status={message.status} />
      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={
            <BlogList
              blogs={blogs}
              user={user}/>
          }/>
          <Route path="/login" element={
            user
              ? <Navigate replace to="/" />
              : <LoginForm handleLogin={handleLogin} />
          }/>
          <Route path="/create" element={
            user
              ? <BlogForm createBlog={createBlog} />
              : <Navigate replace to="/"/>
          }/>
          <Route path="/blogs/:id" element={
            <Blog
              blog={blog}
              user={user}
              handleLike={handleLike}
              handleRemove={handleRemove}
            />
          } />
        </Routes>
      </Box>
    </Container>
  )
}

export default App
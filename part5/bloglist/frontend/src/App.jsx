import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'

import {
  Routes, Route, Link, Navigate, useMatch, useNavigate
} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'

const App = () => {
  const blogFormRef = useRef()
  const navigate = useNavigate()

  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
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
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
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
      setErrorMessage('title and url are required')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat({ ...returnedBlog, user }))
      setMessage(`a new blog ${blogObject.title} by ${blogObject.author} was added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('could not add new blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

    blogFormRef.current.toggleVisibility()
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
      setMessage(`blog ${blogObject.title} by ${blogObject.author} was removed`)
      setTimeout(() => {
        setMessage(null)
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

  const padding = {
    padding: 5
  }

  return (
    <>
      <div>
        <Link style={ padding } to="/">home</Link>
        {!user
          ? <Link style={ padding } to="/login">login</Link>
          : <button onClick={handleLogout}>logout</button>}
      </div>
      <ErrorNotification message={errorMessage} />
      <Notification message={message} />
      <Routes>
        <Route path="/" element={
          <div>
            <h1>blogs</h1>
            {user &&
            <>
              <p>{user.username} logged in</p>
              <Togglable buttonLabel='create new blog' ref={blogFormRef}>
                <BlogForm
                  createBlog={createBlog}
                />
              </Togglable>
            </>}
            <BlogList blogs={blogs} user={user} handleLike={handleLike} handleRemove={handleRemove}/>
          </div>
        }/>
        <Route path="/login" element={
          user
            ? <Navigate replace to="/" />
            : <LoginForm handleLogin={handleLogin} />
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
    </>
  )
}

export default App
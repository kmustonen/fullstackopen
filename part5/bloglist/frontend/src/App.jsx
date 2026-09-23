import { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const blogFormRef = useRef()

  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(function(a,b) {return b.likes - a.likes}) )
    )

    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ({ username, password}) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user)
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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
    blogObject = { ...blogObject, likes: blogObject.likes + 1}
    await blogService.update(blogObject)

    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(function(a,b) {return b.likes - a.likes}) )
    )
  }
  
  const handleRemove = async (blogObject) => {
    if (window.confirm(`remove blog ${blogObject.title} by ${blogObject.author}`)) {
      await blogService.remove(blogObject)
    }

    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(function(a,b) {return b.likes - a.likes}) )
    )

    setMessage(`blog ${blogObject.title} by ${blogObject.author} was removed`)
  }

  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <Notification message={message} />
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && (
      <div>
        <h1>blogs</h1>
        <p>{user.username} logged in</p>
        <button onClick={handleLogout}>logout</button>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogForm
            createBlog={createBlog}
          />
        </Togglable>
      </div>
      )}
      {user && blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} handleRemove={handleRemove}/>
      )}
    </div>
  )
}

export default App
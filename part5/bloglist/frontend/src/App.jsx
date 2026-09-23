import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('')  
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
    
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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

  const addBlog = async event => {
    event.preventDefault()

    if (!newBlogTitle || !newBlogUrl) {
      setErrorMessage('title and url are required')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog ${newBlogTitle} by ${newBlogAuthor} was added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
    } catch {
      setErrorMessage('could not add new blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>login</h2>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label>Title: <input value={newBlogTitle} onChange={({ target }) => setNewBlogTitle(target.value)} /></label>
      </div>
      <div>
        <label>Author: <input value={newBlogAuthor} onChange={({ target }) => setNewBlogAuthor(target.value)} /></label>
      </div>
      <div>
        <label>Url: <input value={newBlogUrl} onChange={({ target }) => setNewBlogUrl(target.value)} /></label>
      </div>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <Notification message={message} />

      {!user && loginForm()}
      {user && (
      <div>
        <h1>blogs</h1>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
        <h2>create</h2>
        {blogForm()}
      </div>
      )}
      {user && blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetails, setShowDetails] = useState(false)

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} {showDetails
          ? <button onClick={() => setShowDetails(false)}>hide</button>
          : <button onClick={() => setShowDetails(true)}>view</button>}
      </div>
      {showDetails && <div>
        <div>
          {blog.url}
        </div>
        <div>
      Likes: {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        {(blog.user.username === user.username) && <button  onClick={() => handleRemove(blog)}>remove</button>}
      </div>}
    </div>
  )
}

export default Blog
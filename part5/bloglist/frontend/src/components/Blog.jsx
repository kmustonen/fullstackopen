const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!blog) return null

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
      <div>
        <a href={blog.url}>
          {blog.url}
        </a>
        <div>
      likes: {blog.likes} {user && <button onClick={() => handleLike(blog)}>like</button>}
        </div>
        <div>
          {blog.user.name}
        </div>
        {user && blog.user.username === user.username && <button  onClick={() => handleRemove(blog)}>remove</button>}
      </div>
    </div>
  )
}

export default Blog
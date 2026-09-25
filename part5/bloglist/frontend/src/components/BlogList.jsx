import { Link } from 'react-router-dom'

const BlogList = ({ blogs, user }) => {
  return (
    <div>
      <h1>blogs</h1>
      {user && <p>{user.username} logged in</p>}
      <ul>
        {blogs.map(blog =>
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default BlogList
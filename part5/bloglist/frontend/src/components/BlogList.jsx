import Blog from './Blog'

const BlogList = ({ blogs, user, handleLike, handleRemove }) => {
  return (
    <>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} handleRemove={handleRemove}/>
      )}
    </>
  )
}

export default BlogList
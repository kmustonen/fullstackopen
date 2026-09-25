import { Typography, Button, Stack, Card } from '@mui/material'

const Blog = ({ blog, user, handleLike, handleRemove }) => {

  if (!blog) return null

  return (
    <Card style={{ marginTop: 10, maxWidth: 600 }}>
      <Stack direction='column' style={{ padding: 10 }}>
        <Typography variant='h4'>
          {blog.title}
        </Typography>
        <Typography variant='h6'>
        by {blog.author}
        </Typography>
        <div>
          <a href={blog.url}>{blog.url}</a>
          <div>Added by {blog.user.name}</div>
          <Typography variant='h6'>{blog.likes} likes</Typography>
          <Stack direction='row' spacing={2}>
            {user && <Button variant='outlined' onClick={() => handleLike(blog)}>like</Button>}
            {user && blog.user.username === user.username && <Button variant='outlined' color='error' onClick={() => handleRemove(blog)}>delete</Button>}
          </Stack>
        </div>
      </Stack>
    </Card>
  )
}

export default Blog
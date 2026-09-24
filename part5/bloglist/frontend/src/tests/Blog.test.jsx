import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

describe('<Blog />', () => {
  let mockLikeHandler
  let mockRemoveHandler

  beforeEach(() => {
    const testUser = {
      username: 'username',
      name: 'Test Name'
    }

    const blog = {
      title: 'Test Title',
      author: 'Test Name',
      url: 'Test URL',
      likes: '67',
      user: testUser
    }

    mockLikeHandler = vi.fn()
    mockRemoveHandler = vi.fn()

    render(
      <Blog blog={blog} user={testUser} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler} />
    )
  })

  test('title and author are correctly displayed', async () => {
    screen.getByText('Test Title Test Name')
    screen.getByText('view')
    expect(screen.queryByText('Likes: 67', { exact: false })).toBeNull()
    expect(screen.queryByText('Test URL')).toBeNull()
    expect(screen.queryByText('Test Name')).toBeNull()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('details are shown after clicking view button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)
    screen.getByText('Likes: 67', { exact: false })
    screen.getByText('Test URL')
    screen.getByText('Test Name')
    screen.getByText('remove')
  })

  test('like button calls the like handler', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

describe('<Blog />', () => {
  let mockLikeHandler
  let mockRemoveHandler

  describe('not logged in', () => {
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
        <Blog blog={blog} user={null} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler} />
      )
    })

    test('details are correctly shown', async () => {
      screen.getByText('Test Title')
      screen.getByText('by Test Name')
      screen.getByText('67 likes')
      screen.getByText('Test URL')
      screen.getByText('Added by Test Name')
      expect(screen.queryByText('like')).toBeNull()
      expect(screen.queryByText('delete')).toBeNull()
    })
  })

  describe('blog creator logged in', () => {
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

    test('details are correctly shown', async () => {
      screen.getByText('Test Title')
      screen.getByText('by Test Name')
      screen.getByText('67 likes')
      screen.getByText('Test URL')
      screen.getByText('Added by Test Name')
      screen.getByText('like')
      screen.getByText('delete')
    })

    test('delete button calls the delete handler', async () => {
      const user = userEvent.setup()

      const deleteButton = screen.getByText('delete')
      await user.click(deleteButton)

      expect(mockRemoveHandler.mock.calls).toHaveLength(1)
    })

    test('like button calls the like handler', async () => {
      const user = userEvent.setup()

      const likeButton = screen.getByText('like')
      await user.click(likeButton)
      await user.click(likeButton)

      expect(mockLikeHandler.mock.calls).toHaveLength(2)
    })
  })

  describe('different user logged in', () => {
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

      const anotherUser = {
        username: 'wronguser',
        name: 'Wrong User'
      }

      mockLikeHandler = vi.fn()
      mockRemoveHandler = vi.fn()

      render(
        <Blog blog={blog} user={anotherUser} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler} />
      )
    })

    test('users who are not the blog’s creator are shown only the like button', async () => {
      screen.getByText('like')
      expect(screen.queryByText('delete')).toBeNull()
    })
  })
})
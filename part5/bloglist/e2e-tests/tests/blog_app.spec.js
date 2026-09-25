const { describe, beforeEach, test, expect } = require('@playwright/test')

let token

const loginUser = async (page, username, password) => {
  const textboxes = await page.getByRole('textbox').all()
  await textboxes[0].fill(username)
  await textboxes[1].fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  const textboxes = await page.getByRole('textbox').all()
  await textboxes[0].fill(title)
  await textboxes[1].fill(author)
  await textboxes[2].fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Klaus Mustonen',
        username: 'kmustonen',
        password: 'salasana'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Other User',
        username: 'ouser',
        password: 'password'
      }
    })

    const loginResponse = await request.post('http://localhost:3003/api/login', {
      data: { username: 'kmustonen', password: 'salasana' }
    })
    token = (await loginResponse.json()).token

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'login' })).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('login succeeds with correct credentials', async ({ page }) => {
      await loginUser(page, 'kmustonen', 'salasana')
      await expect(page.getByText('kmustonen logged in')).toBeVisible()
    })

    test('login fails with incorrect credentials', async ({ page }) => {
      await loginUser(page, 'kmustonen', 'wrongpassword')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginUser (page, 'kmustonen', 'salasana')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test URL')

      page.getByText('Test Title Test Author')
      page.getByRole('button', { name: 'view'})
    })

    test('a user can like a created blog', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test URL')
      await page.getByRole('button', { name: 'view'}).click()
      await page.getByRole('button', { name: 'like'}).click()

      await expect(page.getByText('likes: 1')).toBeVisible()
    })

    test('a user can delete a blog they have created', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test URL')
      await page.getByRole('button', { name: 'view'}).click()
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'remove'}).click()

      await expect(page.getByText('Test Title Test Author')).not.toBeVisible()
    })

    test('user who did create the blog can see the remove button', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test URL')
      await page.getByRole('button', { name: 'view'}).click()
      await expect(page.getByRole('button', { name: 'remove'})).toBeVisible()
    })

    test('user who did not create the blog cannot see the remove button', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test URL')
      await page.getByRole('button', { name: 'logout'}).click()
      await loginUser(page, 'ouser', 'password')
      await page.getByRole('button', { name: 'view'}).click()
      await expect(page.getByRole('button', { name: 'remove'})).not.toBeVisible()
    })

    test.only('bloglist is ordered by likes', async ({ page, request }) => {
      await expect(page.getByText('kmustonen logged in')).toBeVisible()

      await request.post('http://localhost:3003/api/blogs', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: 'Test Title 1',
        author: 'author',
        url: 'url',
        likes: 67
      }
      })

      await request.post('http://localhost:3003/api/blogs', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: 'Test Title 2',
        author: 'author',
        url: 'url',
        likes: 87
      }
      })

      await request.post('http://localhost:3003/api/blogs', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: 'Test Title 3',
        author: 'author',
        url: 'url',
        likes: 13
      }
      })

      await request.post('http://localhost:3003/api/blogs', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: 'Test Title 4',
        author: 'author',
        url: 'url',
        likes: 77
      }
      })

      await request.post('http://localhost:3003/api/blogs', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: 'Test Title 5',
        author: 'author',
        url: 'url',
        likes: 17
      }
      })

      await page.reload()
      await expect(page.getByText('kmustonen logged in')).toBeVisible()

      const blogCount = 5
      for (let i = 0; i < blogCount; i++) {
        await page.getByRole('button', { name: 'view' }).first().click()
      }
      
      const likes = page.getByText('likes:', {exact: false})
      await expect(likes).toContainText([
        'likes: 87',
        'likes: 77',
        'likes: 67',
        'likes: 17',
        'likes: 13'])
    })
  })
})
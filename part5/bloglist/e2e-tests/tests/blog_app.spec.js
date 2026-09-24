const { describe, beforeEach, test, expect } = require('@playwright/test')

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

  })
})
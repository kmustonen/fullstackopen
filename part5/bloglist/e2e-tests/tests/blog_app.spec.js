const { describe, beforeEach, test, expect } = require('@playwright/test')

const loginUser = async (page, username, password) => {
  const textboxes = await page.getByRole('textbox').all()
  await textboxes[0].fill(username)
  await textboxes[1].fill(password)
  await page.getByRole('button', { name: 'login' }).click()
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
      await page.getByRole('button', { name: 'create new blog' }).click()

      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('Test Title')
      await textboxes[1].fill('Test Author')
      await textboxes[2].fill('Test URL')
      await page.getByRole('button', { name: 'create' }).click()

      page.getByText('Test Title Test Author')
      page.getByRole('button', { name: 'view'})
    })
  })
})
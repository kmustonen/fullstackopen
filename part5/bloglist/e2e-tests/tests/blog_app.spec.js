const { describe, beforeEach, test, expect } = require('@playwright/test')

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
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('kmustonen')
      await textboxes[1].fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('kmustonen logged in')).toBeVisible()
    })

    test('login fails with incorrect credentials', async ({ page }) => {
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('kmustonen')
      await textboxes[1].fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })
})
const { describe, beforeEach, test, expect } = require('@playwright/test')

const loginUser = async (page, username, password) => {
  await page.getByText('login').click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByText('new blog').click()
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.getByRole('link', { name: 'Test Title by Test Author' })).toBeVisible()
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

    await page.goto('http://localhost:5173')
  })

  describe('Login', () => {
    test('login form is shown', async ({ page }) => {
      await page.getByText('login').click()

      await expect(page.getByLabel('username')).toBeVisible()
      await expect(page.getByLabel('password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })

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
      await loginUser(page, 'kmustonen', 'salasana')
    })

    test('a user can create a blog', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test URL')

      await expect(page.getByRole('link', {name: 'Test Title by Test Author'})).toBeVisible()
    })

    test('a user can like a blog', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test URL')
      await page.getByRole('link', { name: 'Test Title by Test Author' }).click()
      await page.getByRole('button', { name: 'like'}).click()

      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('a user can delete a blog', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test URL')
      await page.getByRole('link', { name: 'Test Title by Test Author' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete'}).click()

      await expect(page.getByRole('link', { name: 'Test Title by Test Author' })).not.toBeVisible()
    })

    test('user who did not create the blog cannot see the remove button', async ({ page }) => {
      await createBlog(page, 'Test Title', 'Test Author', 'Test URL')
      await page.getByText('logout').click()
      await loginUser(page, 'ouser', 'password')
      await page.getByRole('link', { name: 'Test Title by Test Author' }).click()

      await expect(page.getByRole('button', { name: 'delete'})).not.toBeVisible()
    })
  })
})
const bcrypt = require('bcrypt')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')


const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', password: passwordHash })

    await user.save()
  })

  test('creation succeeds with a valid username and password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with an invalid username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      password: 'salainen',
    }

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.deepStrictEqual(usersAtStart, usersAtEnd)
  })

  test('creation fails without username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'nimi',
      password: 'salainen',
    }

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.deepStrictEqual(usersAtStart, usersAtEnd)
  })

  test('creation fails with an invalid username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'kayttajanimi',
      password: 'ab',
    }

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.deepStrictEqual(usersAtStart, usersAtEnd)
  })

  test('creation fails without password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'kayttajanimi',
      name: 'nimi',
    }

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.deepStrictEqual(usersAtStart, usersAtEnd)
  })

})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
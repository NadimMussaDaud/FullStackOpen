const { test, describe , after, beforeEach } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const User =require('../models/user')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach( async () => {
    await User.deleteMany({})
    const userPromises = listHelper.initialUsers.map(user => 
        api.post('/api/users').send(user)
    )
    await Promise.all(userPromises)
})

describe('insertion', () => {
    test("user insertion", async () => {

        const before = await User.find({})

        const newUser = {
            username: "nadaEtudo",
            name: "nada",
            password: "hahah123"
        }

         await api
        .post('/api/users')
        .send(newUser)
        .expect(201)

        const after = await User.find({})

        assert.strictEqual(after.length, before.length + 1)

    })
    

    test('bad insertion', async () => {
        const before = await User.find({})

        const badUser = {
            username: "nadaEtudo",
            name: "nada",
            password: "ha"
        }

        await api
        .post('/api/users')
        .send(badUser)
        .expect(401)

        const after = await User.find({})

        assert.strictEqual(after.length, before.length)

    })
})

describe('get users', () => {
    test('get users with populate blogs', async () => {
        const response = await api
            .get('/api/users')
            .expect(200)

        console.log(response.body)
    })
})

after(async () => {
    await mongoose.connection.close()
})
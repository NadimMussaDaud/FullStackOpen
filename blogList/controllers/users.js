const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate({
        path: 'blogs',
        select: 'title author url'
    })
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body
    const passwordCorrect = password.length >= 3

    if (!(passwordCorrect)) {
        return response.status(401).json({
          error: 'invalid password'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username: username,
        name: name,
        password: passwordHash,
    })
    
    const savedUser = await user.save()
    
    response.status(201).json(savedUser)
})

module.exports =  usersRouter 

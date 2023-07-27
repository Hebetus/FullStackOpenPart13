const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

const { SECRET } = require('../utils/config')
const { User, Session } = require('../models')

loginRouter.post('/', async (req, res) => {
    const body = req.body

    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    const passwordCorrect = body.password === 'salainen'

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET)

    await Session.create({ token: token })

    res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
const logoutRouter = require('express').Router()

const { Session } = require('../models')

logoutRouter.delete('/', async (req, res) => {
    const token = req.get('authorization').substring(7)
    const tokenToRemove = await Session.destroy({
        where: { token: token }
    })
    res.json(tokenToRemove)
})

module.exports = logoutRouter
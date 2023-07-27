const readinglistsRouter = require('express').Router()

const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
const { ReadingList, User, Session } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    }
    catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

readinglistsRouter.get('/', async (req, res) => {
    const readinglists = await ReadingList.findAll({})
    res.json(readinglists)
})

readinglistsRouter.put('/:id', tokenExtractor, async (req, res) => {
    try {
        const token = req.get('authorization').substring(7)
        const user = await User.findByPk(req.decodedToken.id)
        const readinglist = await ReadingList.findByPk(req.params.id)
        const sessionToken = await Session.findByPk(token)
        console.log(sessionToken)
        if (readinglist.userId === user.dataValues.id && req.body.read && !user.dataValues.disabled && (sessionToken.dataValues.token === token)) {
            readinglist.read = true
            await readinglist.save()
            res.json(readinglist)
        }
    }
    catch (error) {
        console.log(error)
    }
})

module.exports = readinglistsRouter
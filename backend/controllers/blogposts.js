const jwt = require('jsonwebtoken')
const blogPostsRouter = require('express').Router()
const { Op } = require('sequelize')

const { SECRET } = require('../utils/config')
const { Blog, User, Session } = require('../models')
const { sequelize } = require('../utils/db')

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

blogPostsRouter.get('/', async (req, res) => {
    let titleToLoweCase
    if (req.query.search) {
      titleToLoweCase = req.query.search.toLowerCase()
    }
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where: {
        [Op.or]: {
          title: sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + titleToLoweCase + '%'),
          author: {
            [Op.substring]: req.query.search ? req.query.search : ''
          }
        }
      },
      order: [
        ['likes', 'DESC']
      ]
    })
    res.json(blogs)
})

blogPostsRouter.post('/', tokenExtractor, async (req, res, next) => {
    try {
      const token = req.get('authorization').substring(7)
      const sessionToken = await Session.findByPk(token)
      const user = await User.findByPk(req.decodedToken.id)
      console.log(user)
      if (req.body.year > 2023 || req.body.year < 1991) {
        res.status(401).json({ error: 'year out of bounds' })
      }
      if (!user.disabled && (sessionToken.dataValues.token === token)) {
        const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
        res.json(blog)
      }
      else {
        res.status(401).json({ error: 'account disabled' })
      }
    }
    catch (error) {
      console.log(error.name)
      next(error)
    }
})

blogPostsRouter.delete('/:id', tokenExtractor, async (req, res) => {
  try {
    const token = req.get('authorization').substring(7)
    const sessionToken = await Session.findByPk(token)
    const user = await User.findByPk(req.decodedToken.id)
    const blogToDestroy = await Blog.findByPk(req.params.id)
    if (blogToDestroy.userId === user.dataValues.id && !user.dataValues.disabled && (sessionToken.dataValues.token === token)) {
      const blog = await Blog.destroy({
        where: { id: req.params.id }
      })
      return res.json(blog)
    }
    else {
      return res.status(400).json({ error: 'blog can only be destroyed by the user that created it' })
    }
  }
  catch (error) {
    console.log(error)
  }
})

blogPostsRouter.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    blog.likes = req.body.likes
    await blog.save()
    res.json(blog)
  }
  catch (error) {
    console.log(error.name)
    next(error)
  }
})

module.exports = blogPostsRouter
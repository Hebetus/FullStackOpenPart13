require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

const blogPostsRouter = require('./controllers/blogposts')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readinglistsRouter = require('./controllers/readinglists')
const logoutRouter = require('./controllers/logout')
const middleware = require('./utils/middleware')

app.use(express.json())
app.use(cors())

/**
 * GENERATE FRONTEND/UI AND NAME THE FOLDER build
 * AND PLACE IT IN THE SAME DIRECTORY AS app.js
 * IF YOU WANT TO USE THIS BACKEND
 */

app.use(express.static('build'))

app.use('/api/blogs', blogPostsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api/logout', logoutRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
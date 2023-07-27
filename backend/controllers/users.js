const usersRouter = require('express').Router()

const { User, Blog, ReadingList } = require('../models')

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        return res.json(user)
    }
    catch (error) {
        next(error)
    }
})

usersRouter.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

usersRouter.put('/:username', async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } })
        user.name = req.body.name
        await user.save()
        res.json(user)
    }
    catch (error) {
        console.log(error.name)
        next(error)
    }
})

usersRouter.get('/:id', async (req, res) => {
    console.log(typeof req.query.read, req.query.read)
    try {
        const user = await User.findByPk(req.params.id)
        const readinglist = await ReadingList.findAll({ where: { userId: req.params.id } })
        let readingsArray = await Promise.all(
            readinglist.map(async row => {
                const blog = await Blog.findByPk(row.dataValues.blogId)
                return { ...blog.dataValues, readinglists: {
                    read: row.dataValues.read,
                    id: row.dataValues.id
                } }
            })
        )
        if (req.query.read) {
            let queryOperator
            if (req.query.read === 'true') {
                queryOperator = true
            }
            else if (req.query.read === 'false') {
                queryOperator = false
            }
            readingsArray = readingsArray.filter(reading => reading.readinglists.read === queryOperator)
        }
        const userJSON = {
            name: user.name,
            username: user.username,
            readings: readingsArray
        }
        res.json(userJSON)
    }
    catch (error) {
        console.log(error)
    }
})

module.exports = usersRouter
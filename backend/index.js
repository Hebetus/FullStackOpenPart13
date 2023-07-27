const http = require('http')
const logger = require('./utils/logger')

const app = require('./app')

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')

const server = http.createServer(app)

/**
server.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`)
})
*/

const start = async () => {
  await connectToDatabase()
  server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
  })
}

start()
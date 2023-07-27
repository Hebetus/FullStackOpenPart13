require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const main = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connected succesfully.')
        const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
        console.log(blogs)
        sequelize.close()
    }
    catch (error) {
        console.log('Unable to connect to database:'. error)
    }
}

main()
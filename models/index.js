'use strict'
const dotenv = require('dotenv')
// process.env.{}
dotenv.config()
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'production'
const config = require(__dirname + '/../config/config.json')[env]
const db = {}

const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost/localnews',
  {
    operatorsAliases: 0,
    dialectOptions: {
      ssl: true,
    },
  }
)

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db

const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'inclo1254', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = connection;

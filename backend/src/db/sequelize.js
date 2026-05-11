// sequelize.js

require("dotenv").config();

const { Sequelize } = require("sequelize");
// const bcrypt = require("bcrypt");


// Connexion entre bdd et sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 10000
    }
  }
)

async function connectWithRetry({ retryDelay = 5000 } = {}) {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Database not ready, retrying in 5s...", err.message);
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    return connectWithRetry({ retryDelay });
  }
}

module.exports = {
  sequelize,
  connectWithRetry
};
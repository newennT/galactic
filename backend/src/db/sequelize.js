// sequelize.js

require("dotenv").config();
console.log("DB_NAME:", process.env.DB_NAME);

const { Sequelize, DataTypes } = require("sequelize");

// Import des models
const ChapterModel = require("../models/chapter");
const LevelModel = require("../models/level");

// import des data-mock
const chapters = require("./data-mock/chapters")
const levels = require("./data-mock/levels")


// Connexion entre bdd et sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ||3306,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 10000
    }
  }
)

function connectWithRetry() {
  sequelize.authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch(err => {
      console.error("Database not ready, retrying in 5s...", err.message);
      setTimeout(connectWithRetry, 5000);
    });
}

connectWithRetry();



// Synchronisation de la base de données avec les données mock
const Chapter = ChapterModel(sequelize, DataTypes);
const Level = LevelModel(sequelize, DataTypes);

const initDb = async () => {
  await sequelize.sync({ force: true });
  console.log("La base de données a été synchronisée avec succès");

  await Promise.all(
    chapters.map(chapter =>
      Chapter.create({
        title: chapter.title,
        abstract: chapter.abstract,
        order: chapter.order,
        isPublished: true
      }).then(chapter => console.log(chapter.toJSON()))
    )
  );

  await Promise.all(
    levels.map(level =>
      Level.create({
        title: level.title
      }).then(level => console.log(level.toJSON()))
    )
  );
};

module.exports = {
    initDb, Chapter, Level

}
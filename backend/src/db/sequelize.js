// sequelize.js

require("dotenv").config();
console.log("DB_NAME:", process.env.DB_NAME);

const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

// Import des models
const ChapterModel = require("../models/chapter");
const LevelModel = require("../models/level");
const ChapterLevelModel = require("../models/chapterLevel");
const PageModel = require("../models/page");
const LessonModel = require("../models/lesson");
const ExerciseModel = require("../models/exercise");
const UniqueResponseModel = require("../models/uniqueResponse");
const PairsModel = require("../models/pairs");
const PutInOrderModel = require("../models/putInOrder");
const UserModel = require("../models/user");
const UserChapterModel = require("../models/userChapter");
const UserExerciseModel = require("../models/userExercise");



// import des data-mock
const chapters = require("./data-mock/chapters");
const levels = require("./data-mock/levels");
const chapterLevels = require("./data-mock/chapterLevels");
const pages = require("./data-mock/pages");
const lessons = require("./data-mock/lessons");
const exercises = require("./data-mock/exercises");
const uniqueResponses = require("./data-mock/uniqueResponses");
const pairs = require("./data-mock/pairs");
const putInOrder = require("./data-mock/putInOrder");
const users = require("./data-mock/users");
const userChapters = require("./data-mock/userChapters");
const userExercises = require("./data-mock/userExercises");


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
const models = {};
models.Chapter = ChapterModel(sequelize, DataTypes);
models.Level = LevelModel(sequelize, DataTypes);
models.Page = PageModel(sequelize, DataTypes);
models.Lesson = LessonModel(sequelize, DataTypes);
models.Exercise = ExerciseModel(sequelize, DataTypes);
models.UniqueResponse = UniqueResponseModel(sequelize, DataTypes);
models.Pairs = PairsModel(sequelize, DataTypes);
models.PutInOrder = PutInOrderModel(sequelize, DataTypes);
models.User = UserModel(sequelize, DataTypes);
models.UserChapter = UserChapterModel(sequelize, DataTypes);
models.UserExercise = UserExerciseModel(sequelize, DataTypes);
models.ChapterLevel = ChapterLevelModel(sequelize, DataTypes);

Object.keys(models).forEach(name => {
  if (models[name].associate) models[name].associate(models);
});

const initDb = async () => {
  await sequelize.sync({ force: true });
  console.log("La base de données a été synchronisée avec succès");

  // levels
  const levelInstances = await Promise.all(
    levels.map(level =>
      models.Level.create({
        id_level: level.id_level,
        title: level.title
      }).then(level => console.log(level.toJSON()))
    )
  );

  // Chapters 
  const chapterInstances = await Promise.all(
    chapters.map(chapter =>
      models.Chapter.create({
        id_chapter: chapter.id_chapter,
        title: chapter.title,
        title_fr: chapter.title_fr,
        abstract: chapter.abstract,
        order: chapter.order,
        isPublished: true
      }).then(chapter => console.log(chapter.toJSON()))
    )
  );

  // chapterLevels
  const chapterLevelInstances = await Promise.all(
    chapterLevels.map(chapterLevel =>
      models.ChapterLevel.create({
        id_level: chapterLevel.id_level,
        id_chapter: chapterLevel.id_chapter
      }).then(chapterLevel => console.log(chapterLevel.toJSON()))
    )
  );

  // pages
  const pageInstances = await Promise.all(
    pages.map(page =>
      models.Page.create({
        id_page: page.id_page,
        title: page.title,
        type: page.type,
        order_index: page.order_index,
        id_chapter: page.id_chapter
      }).then(page => console.log(page.toJSON()))
    )
  );

  // lessons
  const lessonInstances = await Promise.all(
    lessons.map(lesson =>
      models.Lesson.create({
        title: lesson.title,
        content: lesson.content,
        id_page: lesson.id_page
      }).then(lesson => console.log(lesson.toJSON()))
    )
  );

  // exercises
  const exerciseInstances = await Promise.all(
    exercises.map(exercise =>
      models.Exercise.create({
        question: exercise.question,
        feedback: exercise.feedback,
        id_page: exercise.id_page,
        type: exercise.type
      }).then(exercise => console.log(exercise.toJSON()))
    )
  );

  // uniqueResponses
  const uniqueResponseInstances = await Promise.all(
    uniqueResponses.map(uniqueResponse =>
      models.UniqueResponse.create({
        content: uniqueResponse.content,
        is_correct: uniqueResponse.is_correct,
        id_page: uniqueResponse.id_page
      }).then(uniqueResponse => console.log(uniqueResponse.toJSON()))
    )
  );

  // pairs
  const pairsInstances = await Promise.all(
    pairs.map(pair =>
      models.Pairs.create({
        content: pair.content,
        id_page: pair.id_page,
        pair_key: pair.pair_key
      }).then(pair => console.log(pair.toJSON()))
    )
  );

  // putInOrder
  const putInOrderInstances = await Promise.all(
    putInOrder.map(putInOrder =>
      models.PutInOrder.create({
        content: putInOrder.content,
        id_page: putInOrder.id_page,
        mixed_order: putInOrder.mixed_order,
        correct_order: putInOrder.correct_order
      }).then(putInOrder => console.log(putInOrder.toJSON()))
    )
  );


  // users
  const userInstances = await Promise.all(
    users.map(user =>
      models.User.create({
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        password: user.password,
        is_admin: user.is_admin,
        last_login: user.last_login
      }).then(user => console.log(user.toJSON()))
    )
  );

  // userChapters
  const userChapterInstances = await Promise.all(
    userChapters.map(userChapter =>
      models.UserChapter.create({
        id_user: userChapter.id_user,
        id_chapter: userChapter.id_chapter,
        last_chapter_id: userChapter.last_chapter_id
      }).then(userChapter => console.log(userChapter.toJSON()))
    )
  );

  // userExercises
  const userExerciseInstances = await Promise.all(
    userExercises.map(userExercise =>
      models.UserExercise.create({
        id_user: userExercise.id_user,
        id_page: userExercise.id_page,
        is_done: userExercise.is_done,
        is_correct: userExercise.is_correct
      }).then(userExercise => console.log(userExercise.toJSON()))
    )
  );
};

module.exports = {
    initDb, models
}
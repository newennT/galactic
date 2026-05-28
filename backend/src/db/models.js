// src/db/models.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("./sequelize");

const Chapter = require("../models/chapter")(sequelize, DataTypes);
const Level = require("../models/level")(sequelize, DataTypes);
const Page = require("../models/page")(sequelize, DataTypes);
const Lesson = require("../models/lesson")(sequelize, DataTypes);
const Exercise = require("../models/exercise")(sequelize, DataTypes);
const UniqueResponse = require("../models/uniqueResponse")(sequelize, DataTypes);
const Pairs = require("../models/pairs")(sequelize, DataTypes);
const PutInOrder = require("../models/putInOrder")(sequelize, DataTypes);
const User = require("../models/user")(sequelize, DataTypes);
const UserChapter = require("../models/userChapter")(sequelize, DataTypes);
const UserExercise = require("../models/userExercise")(sequelize, DataTypes);

const models = {
    Chapter,
    Level,
    Page,
    Lesson,
    Exercise,
    UniqueResponse,
    Pairs,
    PutInOrder,
    User,
    UserChapter,
    UserExercise,
};

Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});

sequelize.models = models;
module.exports = {
    sequelize,
    ...models
};
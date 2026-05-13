const auth = require("../auth/auth");
const controller = require("../controllers/userExercise.controller");

module.exports = (app) => {

  app.get("/api/user-exercises/chapter/:id", auth, controller.getByChapter);

  app.get("/api/user-exercises/chapter/:id/score", auth, controller.getScore);

  app.post("/api/user-exercises", auth, controller.upsert);

};
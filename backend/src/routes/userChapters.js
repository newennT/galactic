// routes/userChapter.routes.js

const controller = require("../controllers/userChapter.controller");
const auth = require("../auth/auth");

module.exports = (app) => {
  app.get("/api/user-chapters", auth, controller.getUserChapters);

  app.post("/api/user-chapters", auth, controller.upsertUserChapter);
};
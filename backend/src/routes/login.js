const controller = require("../controllers/auth.controller");

module.exports = (app) => {
  app.post("/api/login", controller.login);
};
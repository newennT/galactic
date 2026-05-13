// routes/user.routes.js

const controller = require("../controllers/user.controller");

module.exports = (app) => {
  app.get("/api/users", controller.getAll);

  app.get("/api/users/:id", controller.getById);

  app.post("/api/users", controller.create);

  app.put("/api/users/:id", controller.update);
  
  app.delete("/api/users/:id", controller.remove);
};
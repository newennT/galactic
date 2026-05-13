// routes/uniqueResponse.routes.js

const controller = require("../controllers/uniqueResponse.controller");

module.exports = (app) => {
  app.get("/api/unique", controller.getAll);

  app.get("/api/unique/:id", controller.getById);

  app.post("/api/unique", controller.create);

  app.put("/api/unique/:id", controller.update);
  
  app.delete("/api/unique/:id", controller.remove);
};
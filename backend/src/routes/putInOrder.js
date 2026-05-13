// routes/putInOrder.routes.js

const controller = require("../controllers/putInOrder.controller");

module.exports = (app) => {
  app.get("/api/order", controller.getAll);

  app.get("/api/order/:id", controller.getById);

  app.post("/api/order", controller.create);

  app.put("/api/order/:id", controller.update);
  
  app.delete("/api/order/:id", controller.remove);
};
// server.js

const app = require("./index");
const initDb = require("./src/db/initDb");
const PORT = process.env.PORT || 3000;
const { connectWithRetry } = require("./src/db/sequelize");

async function startServer() {
  try {
    await connectWithRetry();
    console.log('DB connected');
    if (process.env.NODE_ENV !== "test") {
      await initDb();
      console.log('DB Initialized');
    }
    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();
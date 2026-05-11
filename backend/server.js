// server.js

const app = require("./index");
const initDb = require("./src/db/initDb");
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    if (process.env.NODE_ENV !== "test") {
      await initDb();
    }
    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();
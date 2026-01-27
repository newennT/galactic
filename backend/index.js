// index.js

console.log("Node backend starting...");

const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const sequelize = require("./src/db/sequelize");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");

const app = express();


// Middlewares
app
.use(favicon(__dirname + "/favicon.ico"))
.use(morgan("dev"))
.use(bodyParser.json())
.use(cors());



// Appel bdd
sequelize.initDb();


// Routes
app.get("/", (req, res) => {
  res.send("API OK, https://github.com/gowthamrajk/ElearningManagementSystem/tree/main/src/app/services")
})

require("./src/routes/chapter")(app)
require("./src/routes/level")(app)
require("./src/routes/exercise")(app)
require("./src/routes/lesson")(app)
require("./src/routes/page")(app)
require("./src/routes/pairs")(app)
require("./src/routes/uniqueResponse")(app)
require("./src/routes/putInOrder")(app)
require("./src/routes/user")(app)
require("./src/routes/createFullChapter")(app)
require("./src/routes/login")(app)


// Gestion des erreurs
app.use((req, res) => {
  res.status(404).json({ message: "URL not found" });
});

// Server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
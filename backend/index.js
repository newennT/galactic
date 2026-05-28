// index.js

console.log("Node backend starting...");

const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
// const initDb = require("./src/db/initDb");
const favicon = require("serve-favicon");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");


// Middlewares
app
.use(favicon(__dirname + "/favicon.ico"))
.use(morgan("dev"))
.use(bodyParser.json())
.use(cors(
  { methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
   }
))
.options('*', cors());


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
require("./src/routes/login")(app)
require("./src/routes/register")(app)
require("./src/routes/userExercises")(app)
require("./src/routes/userChapters")(app)


// Gestion des erreurs
app.use((req, res) => {
  res.status(404).json({ message: "URL not found" });
});

module.exports = app;

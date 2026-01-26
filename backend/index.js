// index.js

console.log("Node backend starting...");

const express = require("express");
const morgan = require("morgan");
const sequelize = require("./src/db/sequelize");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");

const app = express();


// Middlewares
app
.use(favicon(__dirname + "/favicon.ico"))
.use(morgan("dev"))
.use(bodyParser.json());


// Appel bdd
sequelize.initDb();


// Routes
app.get("/", (req, res) => {
  res.send("Reprendre le cours à 6h18 sur https://www.youtube.com/watch?v=NRxzvpdduvQ")
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


// Gestion des erreurs
app.use(({res}) => {
  const message = "URL not found";
  res.status(404).json({ message });
})

// Server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
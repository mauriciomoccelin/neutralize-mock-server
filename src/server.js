const morgan = require("morgan");
const express = require("express");

const Repository = require("./database/app.repository");
const AppController = require("./controllers/app.controller");

const port = 3000;
const application = express();
const repository = new Repository();

application.use(express.json())
application.use(morgan("short"));

new AppController(application, repository);

application.listen(port, () =>
  console.log(`Mock API listening on port ${port}`)
);

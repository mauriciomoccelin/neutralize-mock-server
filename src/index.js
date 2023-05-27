const db = require("./mock.json");
const express = require("express");

const api = require("./controllers/app");

const port = 3000;
const application = express();

db.forEach((route) => application[route.method](route.path, api.index));

application.listen(port, () => console.log(`Mock API listening on port ${port}`));

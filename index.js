const db = require("./mock.json");
const express = require("express");

const app = express();
const port = 3000;

function isValueMatch(patter, value) {
  const regex = new RegExp(patter);
  return regex.test(value);
}

function isAPIMatch(api, req) {
  const sameMethod = api.method.toLowerCase() === req.method.toLowerCase();
  return [sameMethod, isValueMatch(api.pathMatch, req.path)].every((x) => !!x);
}

function sortMatchsByNotDefault(a, b) {
  return a.defaultMatch === b.defaultMatch ? 0 : a.defaultMatch ? 1 : -1;
}

db.forEach((route) => {
  app[route.method](route.path, (req, res) => {
    let apiMatch;

    for (const api of db) {
      if (isAPIMatch(api, req)) {
        apiMatch = api;
      }
    }

    const matchs = apiMatch.matchs || [];

    for (const match of matchs.sort(sortMatchsByNotDefault)) {
      if (req.params) {
        const params = req.params[match.key];
        if (match.value === params) {
          return res.status(match.statusCode).json(match.response);
        }
      }

      if (req.query) {
        const query = req.query[match.key];
        if (match.value === query) {
          return res.status(match.statusCode).json(match.response);
        }
      }

      if (req.body) {
        const body = req.body[match.key];

        if (match.value === body) {
          return res.status(match.statusCode).json(match.response);
        }
      }

      if (match.defaultMatch) {
        return res.status(match.statusCode).json(match.response);
      }
    }

    return res.status(404).send("Route not maped.");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

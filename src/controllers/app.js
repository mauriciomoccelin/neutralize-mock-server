const db = require("../mock.json");

const isValueMatch = (patter, value) => {
  const regex = new RegExp(patter);
  return regex.test(value);
};

const isAPIMatch = (req, api) => {
  const sameMethod = api.method.toLowerCase() === req.method.toLowerCase();
  return [sameMethod, isValueMatch(api.pathMatch, req.path)].every((x) => !!x);
};

const sortMatchsByNotDefault = (a, b) => {
  return a.defaultMatch === b.defaultMatch ? 0 : a.defaultMatch ? 1 : -1;
};

const getSortedMatchAPI = (req, apis) => {
  let apiMatch;

  for (const api of apis) {
    if (isAPIMatch(req, api)) {
      apiMatch = api;
    }
  }

  const matchs = apiMatch.matchs || [];
  return matchs.sort(sortMatchsByNotDefault);
};

const isMatchFromSource = (match, source) => {
  if (!source) return false;

  const params = source[match.key];
  return match.value === params;
};

const buildReponseFromMatch = (res, match) => {
  if (!match.response) {
    return res.status(match.statusCode).send();
  }

  return res.status(match.statusCode).json(match.response);
};

const index = (req, res) => {
  const matchs = getSortedMatchAPI(req, db);

  for (const match of matchs) {
    if (isMatchFromSource(match, req.params)) {
      return buildReponseFromMatch(res, match);
    }

    if (isMatchFromSource(match, req.query)) {
      return buildReponseFromMatch(res, match);
    }

    if (isMatchFromSource(match, req.body)) {
      return buildReponseFromMatch(res, match);
    }

    if (match.defaultMatch) {
      return buildReponseFromMatch(res, match);
    }
  }

  return res.status(404).send("Route not maped.");
};

module.exports = {
  index,
};

const db = require("../mock.json");

class Repository {
  getApis() {
    return db;
  }
}

module.exports = Repository;

const fs = require("fs");
const path = require("path");

const jsonsInDir = fs
  .readdirSync("src/mocks")
  .filter((file) => path.extname(file) === ".json");

class Repository {
  getApis() {
    const apis = [];
    jsonsInDir.forEach((file) => {
      const fileData = fs.readFileSync(path.join("src/mocks", file));
      const mock = JSON.parse(fileData.toString());

      Array.isArray(mock) ? mock.forEach((m) => apis.push(m)) : apis.push(mock);
    });

    return apis;
  }
}

module.exports = Repository;

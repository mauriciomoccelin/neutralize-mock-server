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
      const json = JSON.parse(fileData.toString());

      apis.push(json);
    });

    return apis;
  }
}

module.exports = Repository;

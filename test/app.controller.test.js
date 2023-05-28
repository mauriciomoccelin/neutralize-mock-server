const express = require("express");
const request = require("supertest");

const Repository = require("../src/database/app.repository");
const AppController = require("../src/controllers/app.controller");

describe("app.controller", () => {
  const application = express();
  const repository = new Repository();

  describe("(GET /v1/users) when get all users", () => {
    let response;
    beforeAll(async () => {
      const controller = new AppController(application, repository).express;

      response = await request(controller).get("/v1/users").send();
    });

    it("should response status 200", () => {
      expect(response.status).toBe(200);
    });

    it("should response all users", () => {
      const expectResult = [
        {
          id: "1",
          name: "Lorem Ipsun",
        },
        {
          id: "1",
          name: "Dolor Sit",
        },
      ];

      expect(response.body).toEqual(expectResult);
    });
  });

  describe("(GET /v1/users) when get all users filtred by name", () => {
    let response;
    beforeAll(async () => {
      const controller = new AppController(application, repository).express;
      const query = {
        name: "Dolor",
      };

      response = await request(controller).get("/v1/users").query(query).send();
    });

    it("should response status 200", () => {
      expect(response.status).toBe(200);
    });

    it("should response all users", () => {
      const expectResult = [
        {
          id: "1",
          name: "Dolor Sit",
        },
      ];

      expect(response.body).toEqual(expectResult);
    });
  });

  describe("(GET /v1/users/:id) when get users by id", () => {
    let response;
    beforeAll(async () => {
      const controller = new AppController(application, repository).express;

      response = await request(controller).get("/v1/users/1").send();
    });

    it("should response status 200", () => {
      expect(response.status).toBe(200);
    });

    it("should response all users", () => {
      const expectResult = {
        id: "1",
        name: "Lorem Ipsun",
      };

      expect(response.body).toEqual(expectResult);
    });
  });

  describe("(POST /v1/users) when create a user", () => {
    let response;
    beforeAll(async () => {
      const controller = new AppController(application, repository).express;
      const payload = {
        name: "Lorem Ipsm",
      };

      response = await request(controller).post("/v1/users").send(payload);
    });

    it("should response status 201", () => {
      expect(response.status).toBe(201);
    });
  });

  describe("(PUT /v1/users/:id) when update a user", () => {
    let response;
    beforeAll(async () => {
      const controller = new AppController(application, repository).express;
      const payload = {
        name: "Lorem Ipsm",
      };

      response = await request(controller).put("/v1/users/1").send(payload);
    });

    it("should response status 204", () => {
      expect(response.status).toBe(204);
    });
  });

  describe("(DELETE /v1/users/:id) when delete a user", () => {
    let response;
    beforeAll(async () => {
      const controller = new AppController(application, repository).express;
      
      response = await request(controller).del("/v1/users/1").send();
    });

    it("should response status 204", () => {
      expect(response.status).toBe(204);
    });
  });
});

// app.test.js
const request = require("supertest");
const app = require("../index");
const { initDb } = require("../src/db/sequelize");


describe("index", () => {

  it("should return 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  it("should return 404", async () => {
    const response = await request(app).get("/not-found");
    expect(response.statusCode).toBe(404);
  });

  
});
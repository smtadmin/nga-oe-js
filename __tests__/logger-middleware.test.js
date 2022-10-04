const mw = require("../src/logger-middleware");
const Producer = require("@siliconmtn/spacelibs-js/core/io/Messaging/Producer");
const { v4: uuidv4 } = require("uuid");

// Mock the producers
jest.mock("@siliconmtn/spacelibs-js/core/io/Messaging/Producer");
Producer.prototype.sendMessage = jest.fn();

describe("Logger Middleware Tests", () => {
  test("Testing BeforeMiddleware", () => {
    let next = jest.fn();
    let req = jest.fn();
    req.url = "localhost";
    mw.sendLog = jest.fn();
    mw.beforeMiddleware(req, jest.fn(), next);
  });

  test("Testing AfterMiddleware", () => {
    let next = jest.fn();
    mw.sendLog = jest.fn();
    let req = jest.fn();
    req.url = "localhost";
    mw.afterMiddleware(req, jest.fn(), next);
  });

  test("sengLog", async () => {
    await mw.sendLog("Test", "Data");
  });

  test("buildMachineLog with User", () => {
    process.env.NODE_SERVER_SERVICE_ID = 'HMF';
    process.env.NODE_SERVER_MICRO_SERVICE_ID = 'NGA:Lib';
    process.env.NODE_SERVER_CLASSIFICATION_LEVEL = 'unclassified';
    process.env.EVENT_NM = 'test';
    
    let userId = uuidv4();
    let data = mw.buildMachineLogMessage("EVENT_INFO", "Test", {
      userId: userId,
    });
    expect(data.data.userId).toBe(userId);
  });
});

/*
File: logger-middleware.test.js
Version: 1.0.0
Project: NGA
Description: Tests for the logger middleware
File Created: Tuesday, 04 October 2022 17:27
Author: Eric Damschroder (edamschroder@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

const mw = require("../src/logger-middleware");
const {parseRequest} = require('../src/reqParser');
const Producer = require("@siliconmtn/spacelibs-js/core/io/Messaging/Producer");
const { v4: uuidv4 } = require("uuid");

// Mock the producers
jest.mock("@siliconmtn/spacelibs-js/core/io/Messaging/Producer");

describe("Logger Middleware Tests", () => {
  beforeEach(() => {
    process.env.NODE_SERVER_SERVICE_ID = 'HMF';
    process.env.NODE_SERVER_MICRO_SERVICE_ID = 'NGA:Lib';
    process.env.NODE_SERVER_CLASSIFICATION_LEVEL = 'unclassified';
    process.env.EVENT_NM = 'test';
    Producer.prototype.sendMessage = jest.fn(() => {return "mId"});
  });

  test("Wrap Call", () => {
    let callback = jest.fn();
    expect(mw.wrapCall(callback).length).toBe(3);
    expect(mw.wrapCall(callback)[1]).toBe(callback);
  });

  test("sendLog Error", async () => {
    let res = await mw.sendLog("Test", "Data", null);
    expect(res).toBe(false);
  });

  test("sendLog", async () => {
    let data = {
      "transactionId": uuidv4(),
      "userId": uuidv4(),
      "sessionId": uuidv4()
    };
    let res = await mw.sendLog("Test", "Data", data);
    expect(res).toBeTruthy();
  });

  test("sendLog with Defaults", async () => {
    let res = await mw.sendLog("Test", "Data");
    expect(res).toBeTruthy();
  });

  test("buildMachineLog with defaults", () => {
    let data = mw.buildMachineLogMessage("EVENT_INFO", "Test");
    expect(data.data.userId).toBe(undefined);
  });

  test("buildMachineLog with User", () => {
    let userId = uuidv4();
    let data = mw.buildMachineLogMessage("EVENT_INFO", "Test", {
      userId: userId,
    });
    expect(data.data.userId).toBe(userId);
  });

  test("buildMachineLog with Session", () => {
    let sessionId = uuidv4();
    let data = mw.buildMachineLogMessage("EVENT_INFO", "Test", {
      sessionId: sessionId,
    });
    expect(data.data.sessionId).toBe(sessionId);
  });

  test("buildMachineLog with Transaction", () => {
    let transactionId = uuidv4();
    let data = mw.buildMachineLogMessage("EVENT_INFO", "Test", {
      transactionId: transactionId,
    });
    expect(data.data.uiTransactionId).toBe(transactionId);
  });

  test("Testing BeforeMiddleware", () => {
    let next = jest.fn();
    let req = jest.fn();
    let res = jest.fn();
    res.writableEnded = jest.fn(() => {return false;})
    req.url = "localhost";
    req.query = {};
    mw.sendLog = jest.fn();
    mw.beforeMiddleware(req, res, next);
  });

  test("Testing AfterMiddleware Continue", () => {
    let next = jest.fn();
    mw.sendLog = jest.fn();
    let res = jest.fn();
    res.writableEnded = jest.fn(() => {return false;})
    let req = jest.fn();
    req.query = {};
    req.url = "localhost";
    mw.afterMiddleware(req, res, next);
  });

  test("Testing AfterMiddleware No Continue", () => {
    let next = jest.fn();
    mw.sendLog = jest.fn();
    let res = jest.fn();
    res.writableEnded = jest.fn(() => {return true;})
    let req = jest.fn();
    req.query = {};
    req.url = "localhost";
    mw.afterMiddleware(req, res, next);
  });

  test("Parse Sanitize All Missing.", () => {
    let req = jest.fn();
    req.method = "POST";
    req.body = {
      abcd: "1234",
      test: true,
    };
    req.url = "https://localhost?a1234=abcdefg";
    req.query = {a1234: "abcdefg"};

    mw.sanitize(req);

    let res = parseRequest(req);
    expect(res.abcd).toBe("1234");
    expect(res.test).toBe(true);
    expect(res.a1234).toBe("abcdefg");
    expect(res.sessionId).toBeTruthy();
    expect(res.transactionId).toBeTruthy();
    expect(res.userId).toBeFalsy();
  });

  test("Parse Sanitize transactionId invalid.", () => {
    let req = jest.fn();
    req.method = "POST";
    req.body = {
      transactionId: "1234",
      test: true,
    };
    req.url = "https://localhost";
    req.query = {};

    mw.sanitize(req);

    let res = parseRequest(req);
    expect(res.sessionId).toBeTruthy();
    expect(res.test).toBe(true);
    expect(res.transactionId).toBeTruthy();
    expect(res.userId).toBeFalsy();
  });

  test("Parse Sanitize transactionId Missing.", () => {
    let req = jest.fn();
    req.method = "POST";
    req.body = {
      sessionId: uuidv4(),
      test: true,
    };
    req.url = "https://localhost";
    req.query = {};

    mw.sanitize(req);

    let res = parseRequest(req);
    expect(res.sessionId).toBe(req.body.sessionId);
    expect(res.test).toBe(true);
    expect(res.transactionId).toBeTruthy();
    expect(res.userId).toBeFalsy();
  });

  test("Parse Sanitize sessionId Missing.", () => {
    let req = jest.fn();
    req.method = "POST";
    req.body = {
      transactionId: uuidv4(),
      test: true,
    };
    req.url = "https://localhost";
    req.query = {};

    mw.sanitize(req);

    let res = parseRequest(req);
    expect(res.transactionId).toBe(req.body.transactionId);
    expect(res.test).toBe(true);
    expect(res.sessionId).toBeTruthy();
    expect(res.userId).toBeFalsy();
  });
});

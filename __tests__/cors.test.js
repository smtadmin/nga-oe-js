/*
File: cors.test.js
Version: 1.0.0
Project: NGA
Description: Tests for cors
File Created: Tuesday, 04 October 2022 17:27
Author: Eric Damschroder (edamschroder@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

const cors = require('../src/middleware/cors');
describe("Feedback Controller Tests", () => {
    test("Testing cors", () => {
      const req = {},
    res = { send: jest.fn(), end: jest.fn(), set: jest.fn() },
    next = jest.fn();

    cors(req, res, next);
        
    expect(res.set.mock.calls[0][0]).toBe("Access-Control-Allow-Origin");
    expect(res.set.mock.calls[1][0]).toBe("Access-Control-Allow-Methods");
    expect(res.set.mock.calls[1][1]).toBe("GET,PUT,POST,DELETE,OPTIONS");
    expect(res.set.mock.calls[2][0]).toBe("Access-Control-Allow-Headers");
    expect(res.set.mock.calls[2][1]).toBe("Content-type,Accept,X-Custom-Header");
    });

    test("Testing options", () => {
      const req = {},
    res = { send: jest.fn(), end: jest.fn(), set: jest.fn(), status: jest.fn()},
    next = jest.fn();
      req.method = "OPTIONS";
    cors(req, res, next);
        
    expect(res.set.mock.calls[0][0]).toBe("Access-Control-Allow-Origin");
    expect(res.set.mock.calls[1][0]).toBe("Access-Control-Allow-Methods");
    expect(res.set.mock.calls[1][1]).toBe("GET,PUT,POST,DELETE,OPTIONS");
    expect(res.set.mock.calls[2][0]).toBe("Access-Control-Allow-Headers");
    expect(res.set.mock.calls[2][1]).toBe("Content-type,Accept,X-Custom-Header");
    expect(res.status.mock.calls[0][0]).toBe(200);
    });
})
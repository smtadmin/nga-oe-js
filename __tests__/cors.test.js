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
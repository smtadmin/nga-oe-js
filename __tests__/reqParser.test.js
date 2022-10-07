/*
File: reqParser.test.js
Version: 1.0.0
Project: NGA
Description: Tests for reqParser
File Created: Tuesday, 04 October 2022 17:27
Author: Eric Damschroder (edamschroder@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

const { parseRequest } = require("../src/reqParser");

describe("App Tests", () => {
  test("Parse Get", () => {
    let req = jest.fn();
    req.method = "GET";
    req.url = "https://localhost?abcd=1234&test=true";

    let res = parseRequest(req);
    expect(res.abcd).toBe("1234");
    expect(res.test).toBe("true");
  });
  test("Parse Post With Query", () => {
    let req = jest.fn();
    req.method = "POST";
    req.body = {
      abcd: "1234",
      test: true,
    };
    req.url = "https://localhost?a1234=abcdefg";
    req.query = "a1234=abcdefg"

    let res = parseRequest(req);
    expect(res.abcd).toBe("1234");
    expect(res.test).toBe(true);
    expect(res.a1234).toBe("abcdefg");
  });
  test("Parse Post Without Query", () => {
    let req = jest.fn();
    req.method = "POST";
    req.body = {
      abcd: "1234",
      test: true,
    };

    let res = parseRequest(req);
    expect(res.abcd).toBe("1234");
    expect(res.test).toBe(true);
  });
});

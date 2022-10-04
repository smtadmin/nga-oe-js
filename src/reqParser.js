
/*
File: reqParser.js
Version: 1.0.0
Project: NGA
Description: Render a request url into a data map
File Created: Tuesday, 04 October 2022 17:11
Author: Eric Damschroder (edamschroder@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

const url = require("url");

const parseRequest = function (req) {
  if (req.method == "GET") {
    return parseGet(req);
  } else if (req.method == "POST") {
    let data = parsePost(req);
    if(req.query) {
      data = {...data, ...parseGet(req)};
    }
    return data;
  } else {
    return {};
  }
};

function parseGet(req) {
  return url.parse(req.url, true).query;
}

function parsePost(req) {
  return req.body;
}

module.exports = { parseRequest };
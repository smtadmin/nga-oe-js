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
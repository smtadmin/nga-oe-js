/*
File: cors.js
Version: 1.0.0
Project: NGA
Description: Base cors setup for services
File Created: Tuesday, 04 October 2022 17:23
Author: Eric Damschroder (edamschroder@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

module.exports = function (req, res, next) {
    // CORS headers
    res.set("Access-Control-Allow-Origin", process.env.NODE_HMF_DOMAIN); // restrict it to the required domain
    res.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    // Set custom headers for CORS
    res.set("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");

    if (req.method === "OPTIONS") {
        res.status(200);
        return res.end();
    }

    return next();
};
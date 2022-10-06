/*
File: common.js
Version: 1.0.0
Project: NGA
Description: A collection of methods commonly used to setup an app
File Created: Tuesday, 04 October 2022 17:16
Author: Eric Damschroder (edamschroder@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

/**
 * Normalize a port into a number, string, or false.
 */
 const normalizePort = function (val) {
    let checkPort = parseInt(val, 10);
  
    if (isNaN(checkPort)) {
      // named pipe
      return val;
    }
  
    if (checkPort >= 0) {
      // port number
      return checkPort;
    }
  
    return false;
  }
  
  /**
   * Create pulsar listener that will send the recieved messages to a websocket
   * @param {*} server 
   * @param {*} topic 
   * @param {*} name 
   */
  const createPulsarWSManager = function (server, topic, name) {

    const WSManager = require("./wsManager");
    const WebSocket = require("ws");
    const path = process.env.NODE_SERVER_PATH || "/";

    const wss = new WebSocket.Server({ server, path, clientTracking: true });
    

    /**
     * Create the configuration for the producer and consumer
     */
    let consumerConfig = {
        path : process.env.PULSAR_CLIENT_URL,
        jwtToken : process.env.PULSAR_ADMIN_JWT_TOKEN,
        tlsAllowInsecureConnection : process.env.PULSAR_TLS_ALLOW_INSECURE_CONNECTIONS
    };

    let producerConfig = {
      path : process.env.PULSAR_CLIENT_URL,
      jwtToken : process.env.PULSAR_ADMIN_JWT_TOKEN,
      tlsAllowInsecureConnection : process.env.PULSAR_TLS_ALLOW_INSECURE_CONNECTIONS
    };

    /**
     * Instantiate, configure and connect the WebSocket Manager
     */
    const manager = new WSManager(wss, consumerConfig, producerConfig);
    manager.connect(
        topic,
        name
    );
  }

  /**
   * Creates a collection of rolling log files for errors and accessess to be saved to
   * @param {*} app 
   * @param {*} dir 
   */
  const createMorganLogger = function(app, dir) {
    const path = require("path");
    const morgan = require("morgan");
    const rfs = require("rotating-file-stream");
    
    const accessLogStream = rfs.createStream("access.log", {
        interval: "1d", // rotate daily
       path: path.join(dir, "logs/access"),
    });
  
    const errorLogStream = rfs.createStream("error.log", {
        interval: "1d", // rotate daily
        path: path.join(dir, "logs/error"),
    });
    
    morgan.token("error", (req, _res) => `${req.error}`);
        
    const getCustomErrorMorganFormat = () =>
        JSON.stringify({
        method: ":method",
        url: ":url",
        http_version: ":http-version",
        response_time: ":response-time",
        status: ":status",
        content_length: ":res[content-length]",
        timestamp: ":date[iso]",
        headers_count: "req-headers-length",
        error: ":error",
        });
    
    app.use(
        morgan(getCustomErrorMorganFormat(), {
        skip: (_req, res) => res.statusCode < 400,
        stream: errorLogStream,
        })
    );
    
    app.use(
        morgan("combined", {
        stream: accessLogStream,
        })
    );
  }


/**
 * Standard error handler for ERROR events
 */

const errorHandler = function(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

  module.exports = {
    normalizePort,
    createPulsarWSManager,
    createMorganLogger,
    errorHandler
  }
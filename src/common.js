

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
  
  const createPulsarWSManager = function (server, topic, name) {

    const WSManager = require("./wsManager");
    const WebSocket = require("ws");
    const path = process.env.NODE_SERVER_PATH || "/";

    const wss = new WebSocket.Server({ server, path, clientTracking: true });
    

    /**
     * Create the configuration for the producer and consumer
     */
    let consumerConfig = {
        host: "pulsar://" + process.env.PULSAR_SERVER_PORT_6650_TCP_ADDR,
        port: process.env.PULSAR_SERVER_SERVICE_PORT_PULSAR,
    };

    let producerConfig = {
        host: "pulsar://" + process.env.PULSAR_SERVER_PORT_6650_TCP_ADDR,
        port: process.env.PULSAR_SERVER_SERVICE_PORT_PULSAR,
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
 * Event listener for HTTP server "error" event.
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
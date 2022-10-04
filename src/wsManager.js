/*
File: wsManager.js
Version: 1.0.0
Project: nga-hmf
Description: Manages the WS Lifecycle and interactions for the given server.
File Created: Thursday, 04 August 2022 12:55
Author: Billy Larsen (billy@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

require("dotenv").config();
const {parseRequest} = require('./reqParser');
const Consumer = require("@siliconmtn/spacelibs-js/core/io/Messaging/Consumer");
const mw = require('./logger-middleware');
const { validate: validateUUID } = require("uuid");

class WSManager {
  /**
   * Constructs the consumer with the appropriate host and port
   * @param {object} config Configuration for this app.  Must include the
   * host param (URL of the pulsar server) and the port of the server
   */
  constructor(wss, consumerConfig, producerConfig) {
    this.consumerConfig = consumerConfig;
    this.producerConfig = producerConfig;
    this.wss = wss;
    this.topicConsumer = new Consumer(consumerConfig);
  }

  async connect(topic, consumerName) {
    this.consumerName = consumerName;
    await mw.sendLog("EVENT_INFO", `Awaiting ${consumerName} WSS Request`);
    this.wss.on("connection", async (ws, req) => {
      console.log("WSS CONNECTION INITIATED!");
      this.identifyWebSocket(ws, req);
      //On a disconnect/reconnect, ensure that the topicConsumer is closed
      if (this.topicConsumer.consumer != null) {
        await this.topicConsumer.disconnect();
        await mw.sendLog("EVENT_INFO", 
          "Re-Established Consumer after new connection detected",
          ws.userId
        );
      }

      this.topicConsumer.listen(
        topic,
        consumerName,
        async (message, msgConsumer) => {
          this.processMessage(message, msgConsumer);
        }
      );
      await mw.sendLog("EVENT_INFO", `WSS Established for ${consumerName}`, ws.userId);
      console.log("CONNECTION CREATED, RETURNING!");
    });

    this.wss.on("error", (err) => console.log(err));

    this.wss.on("wsClientError", (err, socket, req) => console.log(err, socket, req));

    this.wss.on('close', function close() {console.log('disconnected');});

    this.wss.on('message', function incoming(message) {console.log('received: %s', message);});
  }

  async processMessage(message, msgConsumer) {
    let userId = "1234";
    let json = {};
    try {
      json = JSON.parse(message.getData().toString());
    } catch (err) {}

    if (json.userId && validateUUID(json.userId)) {
      userId = message.getData().userId;
    }

    await mw.sendLog("EVENT_START", 
      `${this.consumerName} Received a Message`,
      message.getData().toString()
    );

    try {
      this.wss.clients.forEach((client) => {
        if (client.userId === userId) {
          client.send(message.getData().toString());
        }
      });
    } catch (err) {}
    msgConsumer.acknowledge(message);
    await mw.sendLog("EVENT_END", 
      `${this.consumerName} Finished Processing Message`,
      message.getData().toString()
    );
    return JSON.parse(message.getData().toString());
  }

  identifyWebSocket(ws, req) {
    ws.userId = parseRequest(req).userId;
  }
}
module.exports = WSManager;
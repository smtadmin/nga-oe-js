const WSManager = require("../src/wsManager.js");
const mw = require("../src/logger-middleware");
const Producer = require("@siliconmtn/spacelibs-js/core/io/Messaging/Producer");
const Consumer = require("@siliconmtn/spacelibs-js/core/io/Messaging/Consumer");
const ServerMocker = require("mock-socket");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const CONSUMER_NM = "ConsumerName";

// Mock the producers
jest.mock("@siliconmtn/spacelibs-js/core/io/Messaging/Producer");
Producer.prototype.sendMessage = jest.fn();

// Mock the consumer
jest.mock("@siliconmtn/spacelibs-js/core/io/Messaging/Consumer");
Consumer.prototype.listen = jest.fn();
Consumer.prototype.disconnect = jest.fn();
Consumer.prototype.connect = jest.fn();

// Create the Mocked Server
const fakeURL = "ws://localhost:8080";
const mockServer = new ServerMocker.Server(fakeURL);

/**
 * Create a dummy app for simulating connections and tracking
 * responses.
 */
class ChatApp {
  constructor(url) {
    this.messages = [];
    this.connection = new ServerMocker.WebSocket(url);
    this.connection.onmessage = (event) => {
      this.messages.push(event.data);
    };
  }

  sendMessage(message) {
    this.connection.send(message);
  }
}

/**
 * Create a dummy Message to simulate messages from the listener.
 */
class Message {
  constructor(data) {
    this.data = data;
  }
  getData() {
    return this.data;
  }
}

describe("WSManager Tests", () => {
  //Instantiate our mockServer for testing
  const manager = new WSManager(mockServer, {}, {});

  test("Testing identifyWebSocket", async () => {
    let req = jest.fn();
    req.url = "https://localhost?userId=1234";
    req.method = "GET";
    let ws = jest.fn();
    manager.identifyWebSocket(ws, req);
    // create a WS instance, listening on port 1234 on localhost
    expect(ws.userId).toBe("1234");
  });

  test("Testing Websocket Lifecycle", async () => {
    //Simulate the initial connect sends proper message
    mw.sendLog = jest.fn();
    manager.identifyWebSocket = (ws, _req) => (ws.userId = "1234");

    manager.connect(jest.fn(), CONSUMER_NM);
    expect(mw.sendLog.mock.calls[0][0]).toBe("EVENT_INFO");
    expect(mw.sendLog.mock.calls[0][1]).toBe(
      `Awaiting ${CONSUMER_NM} WSS Request`);

    //Create our chat client
    const app = new ChatApp(fakeURL + "?userId=1234");

    //Simulate an incoming connection and proper messages are sent.
    await new Promise((r) => setTimeout(r, 100));
    expect(mw.sendLog.mock.calls[1][0]).toBe("EVENT_INFO");
    expect(mw.sendLog.mock.calls[1][1]).toBe(
      `WSS Established for ${CONSUMER_NM}`
    );

    manager.topicConsumer.consumer = jest.fn();

    //Create a second chat client to simulate an unexpected disconnect and re-connect
    const app2 = new ChatApp(fakeURL + "?userId=1234");

    //Verify re-connect is successfully negotiated
    await new Promise((r) => setTimeout(r, 100));
    expect(mw.sendLog.mock.calls[2][0]).toBe("EVENT_INFO");
    expect(mw.sendLog.mock.calls[2][1]).toBe(
      "Re-Established Consumer after new connection detected"
    );
    expect(mw.sendLog.mock.calls[3][0]).toBe("EVENT_INFO");
    expect(mw.sendLog.mock.calls[3][1]).toBe(
      `WSS Established for ${CONSUMER_NM}`
    );

    //Simulate Receiving an Async Message and data is properly handled and sent.
    let msg = new Message('{"msg": "Hello World", "state": "default"}');
    let msgConsumer = jest.fn();
    msgConsumer.acknowledge = jest.fn();
    await manager.processMessage(msg, msgConsumer, jest.fn());

    //Verify Proper async processing responses.
    await new Promise((r) => setTimeout(r, 100));
    expect(mw.sendLog.mock.calls[4][0]).toBe("EVENT_START");
    expect(mw.sendLog.mock.calls[4][1]).toBe(
      `${CONSUMER_NM} Received a Message`
    );
    expect(mw.sendLog.mock.calls[5][0]).toBe("EVENT_END");
    expect(mw.sendLog.mock.calls[5][1]).toBe(
      `${CONSUMER_NM} Finished Processing Message`
    );
  });

  test("Process Message", async () => {
    const logEvent = jest.spyOn(mw, 'sendLog');

    //Simulate Receiving an Async Message and data is properly handled and sent.
    let userId = uuidv4();
    let msg = new Message(
      '{"msg": "Hello World", "state": "default", "userId": "' + userId + '"}'
    );
    let msgConsumer = jest.fn();
    msgConsumer.acknowledge = jest.fn();
    let payload = await manager.processMessage(msg, msgConsumer, true);
    expect(payload.userId).toBe(userId);
    expect(logEvent).toHaveBeenCalled();
  });

  test("Process Message don't send logs", async () => {
    const logEvent = jest.spyOn(mw, 'sendLog');

    //Simulate Receiving an Async Message and data is properly handled and sent.
    let userId = uuidv4();
    let msg = new Message(
      '{"msg": "Hello World", "state": "default", "userId": "' + userId + '"}'
    );
    let msgConsumer = jest.fn();
    msgConsumer.acknowledge = jest.fn();
    jest.clearAllMocks();

    let payload = await manager.processMessage(msg, msgConsumer, false);
    expect(payload.userId).toBe(userId);
    expect(logEvent).not.toHaveBeenCalled()
  });

  test("Process Message bad uuid", async () => {
    //Simulate Receiving an Async Message and data is properly handled and sent.
    let msg = new Message(
      '{"msg": "Hello World", "state": "default", "userId": "2134"}'
    );
    let msgConsumer = jest.fn();
    msgConsumer.acknowledge = jest.fn();
    let payload = await manager.processMessage(msg, msgConsumer, true);
    expect(payload.userId).toBe("2134");
  });

  test("Verify Client Send", async () => {
    //Simulate Receiving an Async Message and data is properly handled and sent.
    let msg = new Message(
      '{"msg": "Hello World", "state": "default", "userId": "2134"}'
    );
    manager.wss.clients = [];
    let ws = jest.fn();
    ws.userId = "4321";
    ws.sendApp = jest.fn();
    let ws2 = jest.fn();
    ws2.userId = "1234";
    ws2.sendApp = jest.fn();
    manager.wss.clients.push(ws);
    manager.wss.clients.push(ws2);
    let msgConsumer = jest.fn();
    msgConsumer.acknowledge = jest.fn();
    let payload = await manager.processMessage(msg, msgConsumer, true);
    expect(payload.userId).toBe("2134");
  });
});
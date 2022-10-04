/*
File: context.test.js
Version: 1.0.0
Project: NGA
Description: Test for context.js
File Created: Tuesday, 04 October 2022 17:26
Author: Eric Damschroder (edamschroder@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

const Context = require("../src/vo/Context");

describe("ContextVO Tests", () => {
  test("Testing Full Context", () => {
    let data = {
      userId: "userIdTest",
      orderId: "orderIdTest",
      sessionId: "sessionIdTest",
      workflowId: "workflowIdTest",
      microServiceId: "microServiceIdTest",
      uiTransactionId: "uiTransactionIdTest",
    };
    let c = new Context();
    c.populateContext(data);
    expect(c.userId).toBe(data.userId);
    expect(c.orderId).toBe(data.orderId);
    expect(c.sessionId).toBe(data.sessionId);
    expect(c.workflowId).toBe(data.workflowId);
    expect(c.microServiceId).toBe(data.microServiceId);
    expect(c.uiTransactionId).toBe(data.uiTransactionId);
  });

  test("Testing toJson", () => {
    let data = {
      userId: "userIdTest",
      orderId: "orderIdTest",
      sessionId: "sessionIdTest",
      workflowId: "workflowIdTest",
      microServiceId: "microServiceIdTest",
      uiTransactionId: "uiTransactionIdTest",
    };
    let c = new Context();
    c.populateContext(data);
    expect(c.toJSON()).toStrictEqual(data);
  });

  test("Test missing sessionId", () => {
    let data = {
      microServiceId: "microServiceIdTest",
    };
    let c = new Context();
    const t = () => {
      c.populateContext(data);
    };
    expect(t).toThrow("Missing sessionId");
  });

  test("Test missing microServiceId", () => {
    let data = {
      sessionId: "sessionIdTest",
    };
    let c = new Context();
    const t = () => {
      c.populateContext(data);
    };
    expect(t).toThrow("Missing microServiceId");
  });
});

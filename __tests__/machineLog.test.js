/*
File: machineLog.test.js
Version: 1.0.0
Project: NGA
Description: Tests for the machinelogs
File Created: Tuesday, 04 October 2022 17:27
Author: Eric Damschroder (edamschroder@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

const Context = require("../src/vo/Context");
const MachineLog = require("../src/vo/MachineLog");

describe("MachineLog Tests", () => {
  test("Testing Full Context", () => {
    let data = {
      userId: "userIdTest",
      orderId: "orderIdTest",
      sessionId: "sessionIdTest",
      workflowId: "workflowIdTest",
      microServiceId: "microServiceIdTest",
      uiTransactionId: "uiTransactionIdTest",
      serviceId: "serviceIdTest",
      eventTypeCd: "EVENT_START",
      logLevel: "logLevelTest",
      isSimulation: true,
      executionDateTime: new Date().toISOString(),
      classificationLevel: "classificationLevelTest",
      environment: "environmentTest",
      escalationLevel: 12,
      eventName: "eventNameTest",
      eventSummary: "eventSummaryTest",
      payload: "payloadTest",
      eventDetails: "eventDetailsTest",
      stackTrace: "stackTraceTest",
      originalOrderId: "originalOrderIdTest",
    };

    let m = new MachineLog();
    m.populate(data);
    let c = m.context;
    expect(c.userId).toBe(data.userId);
    expect(c.orderId).toBe(data.orderId);
    expect(c.sessionId).toBe(data.sessionId);
    expect(c.workflowId).toBe(data.workflowId);
    expect(c.microServiceId).toBe(data.microServiceId);
    expect(c.uiTransactionId).toBe(data.uiTransactionId);
    expect(m.serviceId).toBe(data.serviceId);
    expect(m.logLevel).toBe(data.logLevel);
    expect(m.isSimulation).toBe(data.isSimulation);
    expect(m.executionDateTime).toBe(data.executionDateTime);
    expect(m.classificationLevel).toBe(data.classificationLevel);
    expect(m.environment).toBe(data.environment);
    expect(m.escalationLevel).toBe(data.escalationLevel);
    expect(m.eventName).toBe(data.eventName);
    expect(m.eventSummary).toBe(data.eventSummary);
    expect(m.payload).toBe(data.payload);
    expect(m.eventDetails).toBe(data.eventDetails);
    expect(m.stackTrace).toBe(data.stackTrace);
    expect(m.originalOrderId).toBe(data.originalOrderId);
    expect(m.eventTypeCd).toBe(data.eventTypeCd);
  });

  test("Testing toJson", () => {
    let data = {
      userId: "userIdTest",
      orderId: "orderIdTest",
      sessionId: "sessionIdTest",
      workflowId: "workflowIdTest",
      microServiceId: "microServiceIdTest",
      uiTransactionId: "uiTransactionIdTest",
      serviceId: "serviceIdTest",
      logLevel: "logLevelTest",
      isSimulation: true,
      eventTypeCd: "EVENT_START",
      executionDateTime: new Date().toISOString(),
      classificationLevel: "classificationLevelTest",
      environment: "environmentTest",
      escalationLevel: 12,
      eventName: "eventNameTest",
      eventSummary: "eventSummaryTest",
      payload: "payloadTest",
      eventDetails: "eventDetailsTest",
      stackTrace: "stackTraceTest",
      originalOrderId: "originalOrderIdTest",
    };

    let m = new MachineLog();
    m.populate(data);
    let json = {
      eventTypeCd: "EVENT_START",
      serviceId: "serviceIdTest",
      logLevel: "logLevelTest",
      isSimulation: true,
      executionDateTime: data.executionDateTime,
      classificationLevel: "classificationLevelTest",
      environment: "environmentTest",
      escalationLevel: 12,
      eventName: "eventNameTest",
      eventSummary: "eventSummaryTest",
      payload: "payloadTest",
      eventDetails: "eventDetailsTest",
      stackTrace: "stackTraceTest",
      originalOrderId: "originalOrderIdTest",
    };

    json = {
      ...json,
      ...m.context.toJSON(),
    };

    expect(m.toJSON()).toStrictEqual(json);
  });

  test("Test missing logLevel", () => {
    let data = {
      serviceId: "serviceIdTest",
      sessionId: "sessionIdTest",
      microServiceId: "microServiceIdTest",
      classificationLevel: "classificationLevelTest",
      eventName: "eventNameTest",
    };
    let m = new MachineLog();

    const t = () => {
      m.populate(data);
    };
    expect(t).toThrow("Missing logLevel");
  });

  test("Test missing serviceId", () => {
    let data = {
      logLevel: "logLevelTest",
      sessionId: "sessionIdTest",
      microServiceId: "microServiceIdTest",
      classificationLevel: "classificationLevelTest",
      eventName: "eventNameTest",
    };
    let m = new MachineLog();

    const t = () => {
      m.populate(data);
    };
    expect(t).toThrow("Missing serviceId");
  });

  test("Test missing classificationLevel", () => {
    let data = {
      serviceId: "serviceIdTest",
      logLevel: "logLevelTest",
      sessionId: "sessionIdTest",
      microServiceId: "microServiceIdTest",
      eventName: "eventNameTest",
    };
    let m = new MachineLog();

    const t = () => {
      m.populate(data);
    };
    expect(t).toThrow("Missing classificationLevel");
  });

  test("Test missing eventName", () => {
    let data = {
      serviceId: "serviceIdTest",
      logLevel: "logLevelTest",
      sessionId: "sessionIdTest",
      microServiceId: "microServiceIdTest",
      classificationLevel: "classificationLevelTest",
    };
    let m = new MachineLog();

    const t = () => {
      m.populate(data);
    };
    expect(t).toThrow("Missing eventName");
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

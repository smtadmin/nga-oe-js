/*
File: notification.test.js
Version: 1.0.0
Project: NGA
Description: Tests for the notification data bean
File Created: Tuesday, 25 October 2022 9:43
Author: Billy Larsen (billy@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

const NotificationType = require("../src/vo/NotificationType");
const Notification = require("../src/vo/Notification");

describe("Notification Tests", () => {
  test("Testing Full Context", () => {
    let data = {
        ownerId: "ownerId",
        serviceId: "serviceId",
        groupId: "groupId",
        title: "title",
        message: "message",
        microServiceId: "microServiceId",
        sessionId: "sessionId",
        orderId: "orderId",
        environmentId: "environmentId",
        simulationId: "simulationId",
        transactionId: "transactionId",
        notificationType: [],
        ttyNumber: "ttyNumber",
        clearanceLevel: "clearanceLevel",
        severityCode: "severityCode",
        actionable: false,
        emailIds: [],
        smsIds: [],
    };

    let nt = new Notification();
    nt.populate(data);
    expect(nt.ownerId).toBe(data.ownerId);
    expect(nt.serviceId).toBe(data.serviceId);
    expect(nt.groupId).toBe(data.groupId);
    expect(nt.title).toBe(data.title);
    expect(nt.message).toBe(data.message);
    expect(nt.microServiceId).toBe(data.microServiceId);
    expect(nt.sessionId).toBe(data.sessionId);
    expect(nt.orderId).toBe(data.orderId);
    expect(nt.simulationId).toBe(data.simulationId);
    expect(nt.transactionId).toBe(data.transactionId);
    expect(nt.environmentId).toBe(data.environmentId);
    expect(nt.notificationType).toBe(data.notificationType);
    expect(nt.ttyNumber).toBe(data.ttyNumber);
    expect(nt.clearanceLevel).toBe(data.clearanceLevel);
    expect(nt.severityCode).toBe(data.severityCode);
    expect(nt.actionable).toBe(data.actionable);
    expect(nt.emailIds).toBe(data.emailIds);
    expect(nt.smsIds).toBe(data.smsIds);
  });

  test("Testing toJson", () => {
    let data = {
        ownerId: "ownerId",
        serviceId: "serviceId",
        groupId: "groupId",
        title: "title",
        message: "message",
        microServiceId: "microServiceId",
        sessionId: "sessionId",
        orderId: "orderId",
        environmentId: "environmentId",
        simulationId: "simulationId",
        transactionId: "transactionId",
        notificationType: [],
        ttyNumber: "ttyNumber",
        clearanceLevel: "clearanceLevel",
        severityCode: "severityCode",
        actionable: false,
        emailIds: [],
        smsIds: [],
    };

    let nt = new Notification();
    nt.populate(data);
    expect(nt.toJSON()).toStrictEqual(data);
  });

  test("Test missing ownerId", () => {
    let data = {
        serviceId: "serviceId",
        title: "title",
        message: "message",
        microServiceId: "microServiceId",
        sessionId: "sessionId",
        environmentId: "environmentId",
        transactionId: "transactionId"
    };
    let nt = new Notification();

    const t = () => {
      nt.populate(data);
    };
    expect(t).toThrow("Missing ownerId");
  });

  test("Test missing serviceId", () => {
    let data = {
        ownerId: "ownerId",
        title: "title",
        message: "message",
        microServiceId: "microServiceId",
        sessionId: "sessionId",
        environmentId: "environmentId",
        transactionId: "transactionId"
    };
    let nt = new Notification();

    const t = () => {
      nt.populate(data);
    };
    expect(t).toThrow("Missing serviceId");
  });

  test("Test missing title", () => {
    let data = {
        ownerId: "ownerId",
        serviceId: "serviceId",
        message: "message",
        microServiceId: "microServiceId",
        sessionId: "sessionId",
        environmentId: "environmentId",
        transactionId: "transactionId"
    };
    let nt = new Notification();

    const t = () => {
      nt.populate(data);
    };
    expect(t).toThrow("Missing title");
  });

  test("Test missing message", () => {
    let data = {
        ownerId: "ownerId",
        serviceId: "serviceId",
        title: "title",
        microServiceId: "microServiceId",
        sessionId: "sessionId",
        environmentId: "environmentId",
        transactionId: "transactionId"
    };
    let nt = new Notification();

    const t = () => {
      nt.populate(data);
    };
    expect(t).toThrow("Missing message");
  });
  test("Test missing microServiceId", () => {
    let data = {
        ownerId: "ownerId",
        serviceId: "serviceId",
        title: "title",
        message: "message",
        sessionId: "sessionId",
        environmentId: "environmentId",
        transactionId: "transactionId"
    };
    let nt = new Notification();

    const t = () => {
      nt.populate(data);
    };
    expect(t).toThrow("Missing microServiceId");
  });
  test("Test missing sessionId", () => {
    let data = {
        ownerId: "ownerId",
        serviceId: "serviceId",
        title: "title",
        message: "message",
        microServiceId: "microServiceId",
        environmentId: "environmentId",
        transactionId: "transactionId"
    };
    let nt = new Notification();

    const t = () => {
      nt.populate(data);
    };
    expect(t).toThrow("Missing sessionId");
  });
  test("Test missing environmentId", () => {
    let data = {
        ownerId: "ownerId",
        serviceId: "serviceId",
        title: "title",
        message: "message",
        microServiceId: "microServiceId",
        sessionId: "sessionId",
        transactionId: "transactionId"
    };
    let nt = new Notification();

    const t = () => {
      nt.populate(data);
    };
    expect(t).toThrow("Missing environmentId");
  });
  test("Test missing transactionId", () => {
    let data = {
        ownerId: "ownerId",
        serviceId: "serviceId",
        title: "title",
        message: "message",
        microServiceId: "microServiceId",
        sessionId: "sessionId",
        environmentId: "environmentId",
    };
    let nt = new Notification();

    const t = () => {
      nt.populate(data);
    };
    expect(t).toThrow("Missing transactionId");
  });

  test("Test missing notificationType", () => {
    let data = {
        ownerId: "ownerId",
        serviceId: "serviceId",
        title: "title",
        message: "message",
        microServiceId: "microServiceId",
        sessionId: "sessionId",
        environmentId: "environmentId",
        transactionId: "transactionId"
    };
    let nt = new Notification();
    nt.populate(data);
    expect(nt.notificationType).toStrictEqual([]);
  });

  test("Test add notificationType", () => {
    let data = {
        ownerId: "ownerId",
        serviceId: "serviceId",
        title: "title",
        message: "message",
        microServiceId: "microServiceId",
        sessionId: "sessionId",
        environmentId: "environmentId",
        transactionId: "transactionId"
    };
    let n = new Notification();
    let nt = new NotificationType();
    let ntData = {
        notificationTypeCode: "gumdrop"
    };
    n.populate(data);
    nt.populate(ntData);
    n.addNotificationType(nt.notificationTypeCode);

    expect(n.notificationType.length).toBe(1);
    expect(n.notificationType[0].notificationTypeCode).toBe(nt.notificationTypeCode);
  });
});
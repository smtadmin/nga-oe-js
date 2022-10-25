/*
File: notificationType.test.js
Version: 1.0.0
Project: NGA
Description: Test for notificationType.js
File Created: Tuesday, 25 October 2022 9:26
Author: Billy Larsen (billy@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

const NotificationType = require("../src/vo/NotificationType");

describe("NotificationType Tests", () => {
  test("Testing Full Context", () => {
    let data = {
        notificationTypeCode: "gumdrop",
        notificationTypeXrId: "1234",
        notificationId: "5678",
    };
    let nt = new NotificationType();
    nt.populate(data);
    expect(nt.notificationTypeCode).toBe(data.notificationTypeCode);
    expect(nt.notificationTypeXrId).toBe(data.notificationTypeXrId);
    expect(nt.notificationId).toBe(data.notificationId);
  });

  test("Testing toJson", () => {
    let data = {
        notificationTypeCode: "gumdrop",
        notificationTypeXrId: "1234",
        notificationId: "5678",
    };
    let nt = new NotificationType();
    nt.populate(data);
    expect(nt.toJSON()).toStrictEqual(data);
  });

  test("Test missing notificationTypeCode", () => {
    let data = {
        notificationTypeXrId: "1234",
        notificationId: "5678",
    };
    let nt = new NotificationType();
    const t = () => {
        nt.populate(data);
    };
    expect(t).toThrow("Missing notificationTypeCode");
  });
});

/*
File: Context.js
Version: 1.0.0
Project: NGA
Description: Data container that holds information related to the current context of the user's session
File Created: Tuesday, 04 October 2022 17:23
Author: Eric Damschroder (edamschroder@siliconmtn.com)
 -----
Last Modified:
 -----
Copyright 2022, Silicon Mountain Technologies, Inc.
*/

class Context {
  populateContext(data) {
    this.userId = data.userId;
    this.orderId = data.orderId;
    this.sessionId = data.sessionId || this._throw("Missing sessionId");
    this.workflowId = data.workflowId;
    this.microServiceId =
      data.microServiceId || this._throw("Missing microServiceId");
    this.uiTransactionId = data.uiTransactionId;
  }

  toJSON() {
    return {
      userId: this._userId,
      orderId: this._orderId,
      sessionId: this._sessionId,
      workflowId: this._workflowId,
      microServiceId: this._microServiceId,
      uiTransactionId: this._uiTransactionId,
    };
  }

  _throw(m) {
    throw m;
  }

  get userId() {
    return this._userId;
  }
  set userId(userId) {
    this._userId = userId;
  }

  get orderId() {
    return this._orderId;
  }
  set orderId(orderId) {
    this._orderId = orderId;
  }

  get sessionId() {
    return this._sessionId;
  }
  set sessionId(sessionId) {
    this._sessionId = sessionId;
  }
  get workflowId() {
    return this._workflowId;
  }
  set workflowId(workflowId) {
    this._workflowId = workflowId;
  }

  get microServiceId() {
    return this._microServiceId;
  }
  set microServiceId(microServiceId) {
    this._microServiceId = microServiceId;
  }

  get uiTransactionId() {
    return this._uiTransactionId;
  }
  set uiTransactionId(uiTransactionId) {
    this._uiTransactionId = uiTransactionId;
  }
}
module.exports = Context;

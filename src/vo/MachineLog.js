const Context = require("./Context");

class MachineLog {
  populate(data) {
    this.eventTypeCd = data.eventTypeCd;
    this.logLevel = data.logLevel || this._throw("Missing logLevel");
    this.serviceId = data.serviceId || this._throw("Missing serviceId");
    this.context = new Context();
    this.context.populateContext(data);
    this.isSimulation = data.isSimulation || false;
    this.executionDateTime = data.executionDateTime || new Date().toISOString();
    this.classificationLevel =
      data.classificationLevel || this._throw("Missing classificationLevel");
    this.environment = data.environment;
    this.escalationLevel = data.escalationLevel || 0;
    this.eventName = data.eventName || this._throw("Missing eventName");
    this.eventSummary = data.eventSummary;
    this.payload = data.payload;
    this.eventDetails = data.eventDetails;
    this.stackTrace = data.stackTrace;
    this.originalOrderId = data.originalOrderId;
  }

  toJSON() {
    return {
      eventTypeCd: this._eventTypeCd,
      serviceId: this._serviceId,
      logLevel: this._logLevel,
      isSimulation: this._isSimulation,
      executionDateTime: this._executionDateTime,
      classificationLevel: this._classificationLevel,
      environment: this._environment,
      escalationLevel: this._escalationLevel,
      eventName: this._eventName,
      eventSummary: this._eventSummary,
      payload: this._payload,
      eventDetails: this._eventDetails,
      stackTrace: this._stackTrace,
      originalOrderId: this._originalOrderId,
      ...this._context.toJSON(),
    };
  }

  _throw(m) {
    throw m;
  }

  get context() {
    return this._context;
  }
  set context(context) {
    this._context = context;
  }

  get serviceId() {
    return this._serviceId;
  }
  set serviceId(serviceId) {
    this._serviceId = serviceId;
  }

  get eventTypeCd() {
    return this._eventTypeCd;
  }
  set eventTypeCd(eventTypeCd) {
    this._eventTypeCd = eventTypeCd;
  }

  get logLevel() {
    return this._logLevel;
  }
  set logLevel(logLevel) {
    this._logLevel = logLevel;
  }

  get isSimulation() {
    return this._isSimulation;
  }
  set isSimulation(isSimulation) {
    this._isSimulation = isSimulation;
  }

  get executionDateTime() {
    return this._executionDateTime;
  }
  set executionDateTime(executionDateTime) {
    this._executionDateTime = executionDateTime;
  }

  get classificationLevel() {
    return this._classificationLevel;
  }
  set classificationLevel(classificationLevel) {
    this._classificationLevel = classificationLevel;
  }

  get environment() {
    return this._environment;
  }
  set environment(environment) {
    this._environment = environment;
  }

  get escalationLevel() {
    return this._escalationLevel;
  }
  set escalationLevel(escalationLevel) {
    this._escalationLevel = escalationLevel;
  }

  get eventName() {
    return this._eventName;
  }
  set eventName(eventName) {
    this._eventName = eventName;
  }

  get eventSummary() {
    return this._eventSummary;
  }
  set eventSummary(eventSummary) {
    this._eventSummary = eventSummary;
  }

  get payload() {
    return this._payload;
  }
  set payload(payload) {
    this._payload = payload;
  }

  get eventDetails() {
    return this._eventDetails;
  }
  set eventDetails(eventDetails) {
    this._eventDetails = eventDetails;
  }

  get stackTrace() {
    return this._stackTrace;
  }
  set stackTrace(stackTrace) {
    this._stackTrace = stackTrace;
  }

  get originalOrderId() {
    return this._originalOrderId;
  }
  set originalOrderId(originalOrderId) {
    this._originalOrderId = originalOrderId;
  }
}
module.exports = MachineLog;

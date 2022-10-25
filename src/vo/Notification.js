const NotificationType = require("./NotificationType");


class Notification {

    populate(data) {
        this.ownerId = data.ownerId || this._throw("Missing ownerId");
        this.serviceId = data.serviceId || this._throw("Missing serviceId");
        this.groupId = data.groupId;
        this.title = data.title || this._throw("Missing title");
        this.message = data.message || this._throw("Missing message");
        this.microServiceId = data.microServiceId || this._throw("Missing microServiceId");
        this.sessionId = data.sessionId || this._throw("Missing sessionId");
        this.orderId = data.orderId;
        this.environmentId = data.environmentId || this._throw("Missing environmentId");
        this.simulationId = data.simulationId;
        this.transactionId = data.transactionId || this._throw("Missing transactionId");
        this.notificationType = data.notificationType || [];
        this.ttyNumber = data.ttyNumber;
        this.clearanceLevel = data.clearanceLevel;
        this.severityCode = data.severityCode;
        this.actionable = data.actionable;
        this.emailIds = data.emailIds;
        this.smsIds = data.smsIds;
    }

    toJSON() {
        return {
            ownerId: this._ownerId,
            serviceId: this._serviceId,
            groupId: this._groupId,
            title: this._title,
            message: this._message,
            microServiceId: this._microServiceId,
            sessionId: this._sessionId,
            orderId: this._orderId,
            environmentId: this._environmentId,
            simulationId: this._simulationId,
            transactionId: this._transactionId,
            notificationType: this._notificationType,
            ttyNumber: this._ttyNumber,
            clearanceLevel: this._clearanceLevel,
            severityCode: this._severityCode,
            actionable: this._actionable,
            emailIds: this._emailIds,
            smsIds: this._smsIds,
        };
    }

    addNotificationType(notificationTypeCode) {
        let type = new NotificationType();
        type.notificationTypeCode = notificationTypeCode
        this.notificationType.push(type);
    }

    _throw(m) {
        throw m;
    }

    get ownerId() {
        return this._ownerId;
    }
    set ownerId(ownerId) {
        this._ownerId = ownerId;
    }

    get serviceId() {
        return this._serviceId;
    }
    set serviceId(serviceId) {
        this._serviceId = serviceId;
    }

    get groupId() {
        return this._groupId;
    }
    set groupId(groupId) {
        this._groupId = groupId;
    }

    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
    }

    get message() {
        return this._message;
    }
    set message(message) {
        this._message = message;
    }

    get microServiceId() {
        return this._microServiceId;
    }
    set microServiceId(microServiceId) {
        this._microServiceId = microServiceId;
    }

    get sessionId() {
        return this._sessionId;
    }
    set sessionId(sessionId) {
        this._sessionId = sessionId;
    }

    get environmentId() {
    return this._environmentId;
    }
    set environmentId(environmentId) {
    this._environmentId = environmentId;
    }

    get orderId() {
    return this._orderId;
    }
    set orderId(orderId) {
    this._orderId = orderId;
    }

    get simulationId() {
        return this._simulationId;
    }
    set simulationId(simulationId) {
        this._simulationId = simulationId;
    }

    get transactionId() {
        return this._transactionId;
    }
    set transactionId(transactionId) {
        this._transactionId = transactionId;
    }

    get notificationType() {
        return this._notificationType;
    }
    set notificationType(notificationType) {
        this._notificationType = notificationType;
    }

    get ttyNumber() {
        return this._ttyNumber;
    }
    set ttyNumber(ttyNumber) {
        this._ttyNumber = ttyNumber;
    }

    get clearanceLevel() {
        return this._clearanceLevel;
    }
    set clearanceLevel(clearanceLevel) {
        this._clearanceLevel = clearanceLevel;
    }

    get severityCode() {
        return this._severityCode;
    }
    set severityCode(severityCode) {
        this._severityCode = severityCode;
    }

    get actionable() {
        return this._actionable;
    }
    set actionable(actionable) {
        this._actionable = actionable;
    }

    get emailIds() {
        return this._emailIds;
    }
    set emailIds(emailIds) {
        this._emailIds = emailIds;
    }

    get smsIds() {
        return this._smsIds;
    }
    set smsIds(smsIds) {
        this._smsIds = smsIds;
    }
}

module.exports = Notification;
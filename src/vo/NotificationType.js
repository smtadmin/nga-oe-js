class NotificationType {
    populate(data) {
        this.notificationTypeCode = data.notificationTypeCode || this._throw("Missing notificationTypeCode");
        this.notificationTypeXrId = data.notificationTypeXrId;
        this.notificationId = data.notificationId;
    }

    toJSON() {
        return {
            notificationTypeCode: this.notificationTypeCode,
            notificationTypeXrId: this._notificationTypeXrId,
            notificationId: this._notificationId,
        };
    }

    _throw(m) {
        throw m;
    }

    get notificationTypeCode() {
        return this._notificationTypeCode;
    }
    set notificationTypeCode(notificationTypeCode) {
        this._notificationTypeCode = notificationTypeCode;
    }

    get notificationTypeXrId() {
        return this._notificationTypeXrId;
    }
    set notificationTypeXrId(notificationTypeXrId) {
        this._notificationTypeXrId = notificationTypeXrId;
    }

    get notificationId() {
        return this._notificationId;
    }
    set notificationId(notificationId) {
        this._notificationId = notificationId;
    }
}

module.exports = NotificationType;
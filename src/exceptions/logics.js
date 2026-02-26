const { notError, notRequestError } = require("not-error/src/index.cjs");

//delete wasnt successful, or error, or count of deleted documents dont match requested
class NotificationException extends notError {
    constructor(result) {
        super("DB Delete Was Not Successful", result);
    }
}

module.exports.NotificationException = NotificationException;
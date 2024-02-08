const messageHandler = require("./message");

const errorHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error("[ERROR] Error caught:" + error);

        return res.redirect(
            `/${messageHandler.formatMessage(
                "We encountered a problem and are working on it!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    });
};

module.exports = errorHandler;

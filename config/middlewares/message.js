const MESSAGE_STATUSES = {
    Success: 0,
    Error: 1,
    Warning: 2,
    Information: 3,
};

function formatMessage(text, status) {
    return `?message=${encodeURIComponent(JSON.stringify({ text, status }))}`;
}

function tryToGetMessage(message) {
    return message ? JSON.parse(decodeURIComponent(message)) : message;
}

module.exports = { MESSAGE_STATUSES, formatMessage, tryToGetMessage };

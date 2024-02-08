const VALIDATION_STATUSES = {
    Success: 0,
    Error: 1,
    Warning: 2,
};

function validateUser(User) {
    const minUserName = 5;
    const maxUserName = 70;
    const minEmail = 8;
    const maxEmail = 120;

    const result = { status: VALIDATION_STATUSES.Error, text: "" };

    if (User.username.length < minUserName)
        result.text = `User name is too short! Minimum symbols required ${minUserName}`;
    else if (User.username.length > maxUserName)
        result.text = `User name is too long! Maximum symbols allowed ${maxUserName}`;
    else if (User.email.length < minEmail)
        result.text = `Email address is too short! Minimum symbols required ${minEmail}`;
    else if (User.email.length > maxEmail)
        result.text = `Email address is too long! Maximum symbols allowed ${maxEmail}`;

    if (result.text) return result;

    const passwordResult = validatePassword(User.password);
    return passwordResult;
}

function validatePassword(password) {
    const min = 0;
    const max = 999;
    const result = { status: VALIDATION_STATUSES.Error, text: "" };

    if (password.length < min)
        result.text = `Password is too short! Minimum symbols required ${min}!`;
    else if (password.length > max)
        result.text = `Password is too long! Maximum symbols allowed ${max}`;

    if (!result.text) result.status = VALIDATION_STATUSES.Success;

    return result;
}

module.exports = { validateUser, validatePassword, VALIDATION_STATUSES };

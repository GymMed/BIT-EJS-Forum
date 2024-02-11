const messageStatuses = {};

async function tryGettingMessageStatuses() {
    if (Object.keys(messageStatuses).length < 1) {
        return await getMessageStatuses();
    }

    return messageStatuses;
}

async function getMessageStatuses() {
    const statuses = await fetch(`/api/messenger/statuses`);
    const response = await statuses.json();

    if (response.statuses) {
        for (const status in response.statuses) {
            messageStatuses[status] = response.statuses[status];
        }
    }

    return messageStatuses;
}

async function messengerFetch(url) {
    const defaultErrorStatus = 1;
    let resultStatus = defaultErrorStatus;

    try {
        const promise = await fetch(url);
        const response = await promise.json();

        if (!response.message) {
            return resultStatus;
        }

        addMessage(response.message, response.status);
        resultStatus = response.status;
    } catch (error) {
        addMessage("We encountered error!", defaultErrorStatus);
    }

    return resultStatus;
}

//liking/disliking
async function increaseNumber(status, increaseBy) {
    const statuses = await tryGettingMessageStatuses();

    if (statuses.Success !== status) return;

    console.log(statuses, status, increaseBy);
}

async function handleLiking(apiEndpoint, increaseBy) {
    const result = await messengerFetch(apiEndpoint);
    await increaseNumber(result, increaseBy);
}

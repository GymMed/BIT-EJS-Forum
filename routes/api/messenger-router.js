const express = require("express");
const router = express.Router();

const messageHandler = require("../../config/middlewares/message");

router.get("/statuses", async (req, res) => {
    return res
        .status(200)
        .json({
            statuses: messageHandler.MESSAGE_STATUSES,
            message: "Successfully retrieved messages",
        });
});

module.exports = router;

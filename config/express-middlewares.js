const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");

const pagesRouter = require("../routes/pages");
// const postRoutes

const messengerApiRouter = require("../routes/api/messenger-router");
const userApiRouter = require("../routes/api/user-router");
const postApiRouter = require("../routes/api/post-router");
const commentApiRouter = require("../routes/api/comment-router");

function config(app) {
    app.set("view engine", "ejs");

    app.use(express.json());
    app.use(bodyParser.urlencoded());
    app.use(
        session({
            secret: process.env.SESSIONS_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: require("./db-connect").mongoUrl,
                collectionName: "sessions",
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7,
            },
        })
    );
    app.use(declareResponseVariables);

    app.locals.APP_NAME = process.env.APP_NAME || "Forum Cinema";

    const publicRoutes = express.Router();
    publicRoutes.use(express.static("public"));
    app.use("/public", publicRoutes);
    app.use("/tinymce", express.static("node_modules/tinymce"));
    app.use(pagesRouter);

    app.use("/api/messenger", messengerApiRouter);
    app.use("/api/user", userApiRouter);
    app.use("/api/post", postApiRouter);
    app.use("/api/comment", commentApiRouter);

    //error handling
    app.use((err, req, res, next) => {
        console.error("[ERROR] Error caught:" + err.stack);

        return res.redirect(
            `/${messageHandler.formatMessage(
                "We encountered a problem and are working on it!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    });
}

function declareResponseVariables(req, res, next) {
    res.locals.currentUrl = req.originalUrl;
    next();
}

module.exports = { config };

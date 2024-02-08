const express = require("express");
const router = express.Router();

const UserModel = require("../models/user");
const PostModel = require("../models/post");
const CommentsModification = require("../utils/modifications/comment");

const messageHandler = require("../config/middlewares/message");

router.get("/", (req, res) => {
    const config = {
        title: "Forum Application",
        user: req.session.user?._doc,
        message: messageHandler.tryToGetMessage(req.query.message),
        list: ["Product1", "Product2", "Milk", "Choklad"],
    };

    return res.render("pages/index", config);
});

router.get("/register", (req, res) => {
    if (req.session.user) {
        return res.redirect(
            `/${messageHandler.formatMessage(
                "You are still logged in! You firstly need to sign out!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const config = {
        title: "Forum Application Register Form",
        user: req.session.user?._doc,
        message: messageHandler.tryToGetMessage(req.query.message),
    };

    return res.render("pages/register/page", config);
});

router.get("/login", (req, res) => {
    if (req.session.user) {
        return res.redirect(
            `/${messageHandler.formatMessage(
                "You are still logged in! You firstly need to sing out!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const config = {
        title: "Forum Application Login Form",
        user: req.session.user?._doc,
        message: messageHandler.tryToGetMessage(req.query.message),
    };

    return res.render("pages/login/page", config);
});

router.get("/profile", async (req, res) => {
    if (!req.session.user) {
        return res.redirect(
            `/login${messageHandler.formatMessage(
                "You need to login to your account first!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const config = {
        title: "Forum Application User Profile",
        user: req.session.user?._doc,
        message: messageHandler.tryToGetMessage(req.query.message),
    };

    return res.render("pages/profile/page", config);
});

router.get("/change-password", async (req, res) => {
    if (!req.session.user) {
        return res.redirect(
            `/login${messageHandler.formatMessage(
                "You need to login to your account first in order to change account password!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const config = {
        title: "Forum Application Change User Password",
        user: req.session.user?._doc,
        message: messageHandler.tryToGetMessage(req.query.message),
    };

    return res.render("pages/change-password/page", config);
});

router.get("/users", async (req, res) => {
    const users = await UserModel.find({});

    const config = {
        title: "Forum Application Users Page",
        user: req.session.user?._doc,
        users,
        message: messageHandler.tryToGetMessage(req.query.message),
    };

    return res.render("pages/users/page", config);
});

router.get("/user/:id/profile", async (req, res) => {
    try {
        const { id } = req.params;

        const userProfile = await UserModel.findOne({ _id: id });

        const config = {
            title: "Forum Application Users Page",
            user: req.session.user?._doc,
            userProfile,
            message: messageHandler.tryToGetMessage(req.query.message),
        };

        return res.render("pages/user-profile/page", config);
    } catch (error) {
        return res.redirect(
            `/${messageHandler.formatMessage(
                "404 User is not found!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }
});

router.get("/posts", async (req, res) => {
    // const posts = await PostModel.find({}).populate("authorId").exec();

    const posts =
        await require("../utils/modifications/post").getAllPostsWithAuthors();

    const config = {
        title: "Forum Application Posts Page",
        user: req.session.user?._doc,
        posts,
        message: messageHandler.tryToGetMessage(req.query.message),
    };

    return res.render("pages/posts/page", config);
});

router.get("/post/create", async (req, res) => {
    if (!req.session.user) {
        return res.redirect(
            `/login${messageHandler.formatMessage(
                "You need to login to your account first in order to publish a post!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const config = {
        title: "Forum Application Post Creation Page",
        user: req.session.user?._doc,
        message: messageHandler.tryToGetMessage(req.query.message),
    };

    return res.render("pages/new-post/page", config);
});

router.get("/post/:id/edit", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect(
                `/login${messageHandler.formatMessage(
                    "You need to login to your account first in order to edit a post!",
                    messageHandler.MESSAGE_STATUSES.Error
                )}`
            );
        }

        const { id } = req.params;
        const post = await PostModel.findOne({ _id: id });

        if (
            !post ||
            post.authorId.toString() !== req.session.user?._doc._id.toString()
        ) {
            return res.redirect(
                `/posts${messageHandler.formatMessage(
                    "404 Post is not found!",
                    messageHandler.MESSAGE_STATUSES.Error
                )}`
            );
        }

        const config = {
            title: "Forum Application Post Edit Page",
            user: req.session.user?._doc,
            post: post,
            editMode: true,
            message: messageHandler.tryToGetMessage(req.query.message),
        };

        return res.render("pages/new-post/page", config);
    } catch (error) {
        return res.redirect(
            `/${messageHandler.formatMessage(
                "404 Post is not found!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }
});

router.get("/post/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const post = await PostModel.findOne({ _id: id });
        const comments =
            await CommentsModification.getAllCommentsWithAuthorsForPost(
                post._id
            );

        const userProfile = await UserModel.findOne({
            _id: post.authorId,
        });

        if (!req.session.user) {
            post.anonymousViewsCount++;
        }

        post.viewsCount++;
        await post.save();

        const config = {
            title: "Forum Application Post Preview Page",
            user: req.session.user?._doc,
            post,
            comments,
            userProfile,
            message: messageHandler.tryToGetMessage(req.query.message),
        };

        return res.render("pages/post/page", config);
    } catch (error) {
        return res.redirect(
            `/${messageHandler.formatMessage(
                "404 Post is not found!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }
});

module.exports = router;

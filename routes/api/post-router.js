const express = require("express");
const router = express.Router();
const PostModel = require("../../models/post");
const UserModel = require("../../models/user");
const upload = require("../../config/multer").upload;

const messageHandler = require("../../config/middlewares/message");

router.get("/", async (req, res) => {
    const allPosts = await PostModel.find({});

    return res.status(200).json(allPosts);
});

router.get("/:id", async (req, res) => {
    const post = await PostModel.findOne({ _id: req.params.id });

    if (!post) {
        return res.status(404).json({ message: "Not found post!" });
    }

    return res.status(200).json({ post: post, message: "Found post!" });
});

router.post("/", async (req, res) => {
    if (!req.session.user) {
        return res.redirect(
            `/login${messageHandler.formatMessage(
                "You need to login to your account first in order to create a post!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const { title, content } = req.body;
    const authorId = req.session.user._doc._id;

    await UserModel.findOneAndUpdate(
        { _id: authorId },
        {
            $inc: { postsCount: 1 },
        }
    );

    const newPost = new PostModel({
        title,
        content,
        authorId,
    });

    await newPost.save();

    return res.redirect(
        `/posts${messageHandler.formatMessage(
            "Post created successfully!",
            messageHandler.MESSAGE_STATUSES.Success
        )}`
    );
});

router.put("/:id/update", async (req, res) => {
    const post = await PostModel.findOne({ _id: req.params.id });
    const { title, content } = req.body;

    if (!post) {
        return res.status(404).json({ message: "Not found post!" });
    }

    if (post.authorId !== req.session.user?.id) {
        return res.status(403).json({
            message:
                "Post doesn't belong for you! You cannot update posts of other users!",
        });
    }

    post.title = title;
    post.content = content;

    await post.save();

    return res.status(200).json({ message: "Post updated successfully!" });
});

router.delete("/:id/remove", async (req, res) => {
    const post = await PostModel.findOne({ _id: req.params.id });

    if (!post) {
        return res.status(404).json({ message: "Not found post!" });
    }

    if (post.authorId !== req.session.user?.id) {
        return res.status(403).json({
            message:
                "Post doesn't belong for you! You cannot delete posts of other users!",
        });
    }

    await UserModel.findOneAndUpdate(
        { _id: post.authorId },
        {
            $inc: { postsCount: -1 },
        }
    );

    //remove comments of the post!
    await PostModel.findOneAndDelete({ _id: req.params.id });

    return res.status(200).json({ message: "Post deleted successfully!" });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const PostModel = require("../../models/post");
const CommentModel = require("../../models/comment");
const UserModel = require("../../models/user");

const upload = require("../../config/multer").upload;

const messageHandler = require("../../config/middlewares/message");

router.get("/", async (req, res) => {
    const allComments = await CommentModel.find({});

    return res.status(200).json(allComments);
});

router.get("/:id", async (req, res) => {
    const comment = await CommentModel.findOne({ _id: req.params.id });

    if (!comment) {
        return res.status(404).json({ message: "Not found comment!" });
    }

    return res
        .status(200)
        .json({ comment: comment, message: "Found comment!" });
});

router.post("/post/:id/", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect(
                `/login${messageHandler.formatMessage(
                    "You need to login to your account first in order to create a comment!",
                    messageHandler.MESSAGE_STATUSES.Error
                )}`
            );
        }

        const { id } = req.params;
        const { content } = req.body;
        const authorId = req.session.user._doc._id;
        const post = await PostModel.findOne({ _id: id });

        if (!post) {
            return res.redirect(
                `/posts${messageHandler.formatMessage(
                    "Provided post is invalid!",
                    messageHandler.MESSAGE_STATUSES.Error
                )}`
            );
        }

        const newComment = new CommentModel({
            content,
            authorId,
            postId: post._id,
        });

        await newComment.save();

        post.commentsCount++;
        post.lastCommentDate = Date.now() + 1000 * 60 * 60 * 2;
        post.lastCommentById = authorId;
        await post.save();

        await UserModel.findOneAndUpdate(
            { _id: newComment.authorId },
            {
                $inc: { commentsCount: 1 },
            }
        );

        return res.redirect(
            `/posts${messageHandler.formatMessage(
                "Comment created successfully!",
                messageHandler.MESSAGE_STATUSES.Success
            )}`
        );
    } catch (Error) {
        return res.redirect(
            `/posts${messageHandler.formatMessage(
                "We encountered a problem and working on it!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }
});

router.post("/user/:id/", async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const user = await UserModel.findOne({ _id: id });

        if (!user) {
            return res.redirect(
                `/posts${messageHandler.formatMessage(
                    "Providede invalid user!",
                    messageHandler.MESSAGE_STATUSES.Error
                )}`
            );
        }

        const comments = await CommentModel.find({ authodId: user._id });

        return res.status(200).json({ comments });
    } catch (Error) {
        return res.redirect(
            `/posts${messageHandler.formatMessage(
                "Provided invalid user !",
                messageHandler.MESSAGE_STATUSES.Success
            )}`
        );
    }
});

router.put("/", async (req, res) => {});

router.delete("/:id ", async (req, res) => {
    const comment = await CommentModel.findOne({ _id: req.params.id });

    if (!comment) {
        return res.status(404).json({ message: "Not found comment!" });
    }

    if (comment.authorId !== req.session.user?.id) {
        return res.status(403).json({
            message:
                "Comment doesn't belong for you! You cannot delete comments of other users!",
        });
    }

    await PostModel.findOneAndUpdate(
        { _id: comment.postId },
        {
            $inc: { commentsCount: -1 },
        }
    );

    await UserModel.findOneAndUpdate(
        { _id: comment.authorId },
        {
            $inc: { commentsCount: -1 },
        }
    );
    await CommentModel.findOneAndDelete({ _id: req.params.id });

    return res.status(200).json({ message: "Comment deleted successfully!" });
});

module.exports = router;

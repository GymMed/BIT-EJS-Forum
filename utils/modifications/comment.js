const mongoose = require("mongoose");
const CommentModel = require("../../models/comment");

async function getAllCommentsWithAuthors() {
    try {
        const comments = await CommentModel.aggregate([
            {
                $lookup: {
                    from: "users", // The name of the "User" collection
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: "$author", // Unwind the array created by $lookup
            },
            {
                $project: {
                    content: 1,
                    author: {
                        _id: "$author._id",
                        username: "$author.username",
                        email: "$author.email",
                    },
                    likesCount: 1,
                    dislikesCount: 1,
                    creationDate: 1,
                },
            },
        ]);

        return comments;
    } catch (Error) {
        console.error(Error);
    }
}

async function getAllCommentsWithAuthorsForPost(postId) {
    try {
        const comments = await CommentModel.aggregate([
            {
                $match: {
                    postId: postId,
                },
            },
            {
                $lookup: {
                    from: "users", // The name of the "User" collection
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: "$author", // Unwind the array created by $lookup
            },
            {
                $project: {
                    content: 1,
                    author: {
                        _id: "$author._id",
                        username: "$author.username",
                        email: "$author.email",
                        profilePicture: "$author.profilePicture",
                        postsCount: "$author.postsCount",
                        commentsCount: "$author.commentsCount",
                        likes: "$author.likes",
                        dislikes: "$author.dislikes",
                        registrationDate: "$author.registrationDate",
                    },
                    likes: 1,
                    dislikes: 1,
                    likedUsers: 1,
                    dislikedUsers: 1,
                    postDate: 1,
                },
            },
        ]);

        return comments;
    } catch (Error) {
        console.error(Error);
    }
}

module.exports = {
    getAllCommentsWithAuthors,
    getAllCommentsWithAuthorsForPost,
};

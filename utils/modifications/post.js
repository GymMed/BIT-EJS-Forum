const PostModel = require("../../models/post");

async function getAllPostsWithAuthors() {
    try {
        const posts = await PostModel.aggregate([
            {
                $lookup: {
                    from: "users", // the name of the "user" collection
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: "$author", // unwind the array created by $lookup
            },
            {
                $lookup: {
                    from: "users",
                    localField: "lastCommentById",
                    foreignField: "_id",
                    as: "lastCommentBy",
                },
            },
            {
                $unwind: {
                    path: "$lastCommentBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    author: {
                        _id: "$author._id",
                        username: "$author.username",
                        email: "$author.email",
                    },
                    anonymousViewsCount: 1,
                    viewsCount: 1,
                    commentsCount: 1,
                    likesCount: 1,
                    dislikesCount: 1,
                    creationDate: 1,
                    tags: 1,
                    images: 1,
                    lastCommentDate: 1,
                    lastCommentBy: {
                        _id: "$lastCommentBy._id",
                        username: "$lastCommentBy.username",
                        email: "$lastCommentBy.email",
                    },
                },
            },
        ]);

        return posts;
    } catch (Error) {
        console.error(Error);
    }
}

module.exports = { getAllPostsWithAuthors };

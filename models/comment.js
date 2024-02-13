const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    postDate: {
        type: Date,
        default: Date.now(),
    },

    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true,
    },

    content: {
        type: String,
        minLength: 8,
        maxLength: 4000,
        required: true,
    },

    likes: {
        type: Number,
        default: 0,
    },

    dislikes: {
        type: Number,
        default: 0,
    },

    likedUsers: [String],

    dislikedUsers: [String],
});

const Model = mongoose.model("comment", schema);
module.exports = Model;

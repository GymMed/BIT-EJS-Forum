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

    likesCount: {
        type: Number,
        default: 0,
    },

    dislikesCount: {
        type: Number,
        default: 0,
    },
});

const Model = mongoose.model("comment", schema);
module.exports = Model;

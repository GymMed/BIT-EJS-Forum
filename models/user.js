const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 70,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 120,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        // minLength: 5,
        // maxLength: 70
    },

    salt: {
        type: String,
    },

    birthDate: {
        type: String,
        required: true,
    },

    profilePicture: {
        type: String,
        required: true,
    },

    postsCount: {
        type: Number,
        default: 0,
        required: true,
    },

    commentsCount: {
        type: Number,
        default: 0,
    },

    likes: {
        type: Number,
        default: 0,
    },

    dislikes: {
        type: Number,
        default: 0,
    },

    registrationDate: {
        type: Date,
        default: new Date(),
        required: true,
    },

    profileLikedUsers: [String],

    profileDislikedUsers: [String],
});

const model = mongoose.model("user", schema);

module.exports = model;

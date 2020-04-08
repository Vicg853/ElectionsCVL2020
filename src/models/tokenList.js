const mongoose = require("mongoose");

const TokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    expireDate: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("TokenBlackList", TokenBlacklistSchema);


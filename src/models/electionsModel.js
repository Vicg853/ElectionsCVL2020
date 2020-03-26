const mongoose = require("mongoose");

const electionsSchema = new mongoose.Schema({
    electionName: {
        type: String,
        required: true,
    },
    numberOfCandidatesToVote: {
        type: Number,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    resultsDate: {
        type: String,
        required: true,
        default: 0,
    },
    totalNumberOfVotes: {
        type: Number,
        required: false,
        default: 0,
    },
    schoolCardUserIDVotedArray: {
        type: Array,
        required: false,
        default: {}
    },
    backgroundUrl: {
        type: String,
        required: false,
        default: ""
    }
});

module.exports = mongoose.model("Election", electionsSchema);
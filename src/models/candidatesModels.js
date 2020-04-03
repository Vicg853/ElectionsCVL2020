const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    electionParticipating: {
        type: String,
        required: true,
    },
    editorPassword: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    numberOfVotes: {
        type: Number,
        required: false,
        default: 0,
    },
    approvedCandidate: {
        type: Boolean,
        required: false,
        default: false,
    },
    imgUrl: {
        type: String,
        required: false,
        default: ""
    },
    classNumber: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model("Candidate", candidateSchema);
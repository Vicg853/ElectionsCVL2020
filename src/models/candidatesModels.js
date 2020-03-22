const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    electionParticipating: {
        type: Array,
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
    }
});

module.exports = mongoose.model("Candidate", candidateSchema);
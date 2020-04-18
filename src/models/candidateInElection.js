const mongoose = require("mongoose");

const candidateInElectionSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true
    },
    electionParticipatingId: {
        type: String,
        required: true
    },
    candidateName: {
        type: String,
        required: true
    },
    Participating: {
        type: Boolean,
        required: false,
        default: false
    },
    NumberOfVotes: {
        type: Number,
        required: false,
        default: 0
    },
}); 

const candidateInElectionModel = mongoose.model("candidateInElection", candidateInElectionSchema);

module.exports = candidateInElectionModel;
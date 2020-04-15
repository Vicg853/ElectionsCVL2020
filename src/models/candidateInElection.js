const mongoose = require("mongoose");

const ElectionSchema = new mongoose.Schema({
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
        required: true
    },
    Blocked: {
        type: Boolean,
        required: true
    },
    NumberOfVotes: {
        type: Number,
        required: true
    },
}); 

const ElectionsModel = mongoose.model("Election", ElectionSchema);

module.exports = ElectionsModel;
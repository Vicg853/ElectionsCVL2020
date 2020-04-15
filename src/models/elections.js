const mongoose = require("mongoose");

const ElectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true
    },
    authorID: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    illustrationUrl: {
        type: String,
        required: false,
        default: "https://images.unsplash.com/photo-1580569530187-a77f37213ffc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=658&q=80"
    },
    numberOfCandidateToVote: {
        type: Number,
        required: true,
    },
    confirmationPassword: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        required: true,
    },
    voters: {
        type: Array,
        required: false,
    },
    numberOfTotalVotes: {
        type: Number,
        required: false
    }
}); 

const ElectionsModel = mongoose.model("Election", ElectionSchema);

module.exports = ElectionsModel;
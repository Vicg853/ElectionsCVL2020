const mongoose = require("mongoose");
      extend = require("mongoose-schema-extend");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    scopes: {
        type: Array,
        required: false,
    },
    mailAddress: {
        type: String,
        required: true,
        trim: true
    },
    userMetadata: {
        type: Array,
        required: false,
    },
    blocked: {
        type: Boolean,
        required: false,
        default: false
    }
});

const candidateSchema = UserSchema.extend({
    age: {
        type: Number,
        required: true,
    },
    electionsParticipating: {
        type: Array,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    numberOfVotesByElection: {
        type: Array,
        required: false,
        default: 0,
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

const UserModel = mongoose.model("User", UserSchema);
const CandidateModel = mongoose.model("Candidate", candidateSchema); 

module.exports = {UserModel, CandidateModel};
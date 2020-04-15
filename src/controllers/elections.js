const electionsModel = require("../models/elections");
const bcrypt = require("bcrypt");

function checkIfElectionExists(infoToCheck, callback) {
    electionsModel.findOne(infoToCheck, (err, queryRes) => {
        if(!infoToCheck._id && err) return callback(1);
        if(infoToCheck._id && err) return callback(2);
        if(!queryRes) return callback(2);
        if(queryRes) return callback(false, true);
    });
    //callback(1) --> 500 error
    //callback(2) --> not found 404
}

function createElection(infoToCreate, callback) {
    //Check if there is going to have a password in the election
    if(infoToCreate.confirmationPassword){
        //If yes, encrypts password
        bcrypt.hash(infoToCreate.confirmationPassword, 8, (err, hash) => {
            //In case of error return callback error
            if(err) return callback(true);
            if(!hash) return callback(true);
            //Changes non encrypted password to encrypted password
            infoToCreate.confirmationPassword = hash;
            //Calls proceed function
            proceed(infoToCreate);
        });
    }else proceed(infoToCreate); //Calls proceed function with password
    // === null so it isn't set in db

    //Function that will proceed election creation in db
    function proceed(infoToCreate) {
        //Mongo db model to create
        electionsModel.create(infoToCreate, (err, createResult) => {
            //In case of error return callback error
            if(err) return callback(true);
            if(!createResult) return callback(true);
            //In case of success returns no error and a little array
            //with some infos
            if(createResult) return callback(false, {
                name: createResult.name,
                authorID: createResult.authorID,
                authorName: createResult.authorName,
                startDate: createResult.startDate,
            });
        });
    }
}

function getElectionInfo(electionId, callback) { 
    //Var that will be sent to check if need to input password
    var password = true;
    //Mongo DB model that gets election info
    electionsModel.findById(electionId, (err, success) => {
        //Return error in case of error
        if(err) return callback(1);
        //Return not found 
        if(!success) return callback(2);
        if(!success.confirmationPassword 
            || success.confirmationPassword === null) password = false;
        if(success) return callback(false, {
            name: success.name,
            authorName: success.authorName,
            authorID: success.authorID,
            startDate: success.startDate,
            endDate: success.endDate,
            illustrationUrl: success.illustrationUrl,
            numberOfCandidateToVote: success.numberOfCandidateToVote,
            illustrationUrl: success.illustrationUrl,
            NeedsPassword: password
        });
    });
}

function modifyElectionInfo(electionId ,infoToModify, callback) {
    var infoVerifiedToModify = {};
    //Check if info is not null, if isn't includes in modification array
    if(infoToModify.startDate !== null && infoToModify.startDate !== undefined && infoToModify.startDate !== "") 
        infoVerifiedToModify.startDate = infoToModify.startDate;
    if(infoToModify.endDate !== null && infoToModify.endDate !== undefined && infoToModify.endDate !== "") 
        infoVerifiedToModify.endDate = infoToModify.endDate;
    if(infoToModify.illustrationUrl !== null && infoToModify.illustrationUrl !== undefined && infoToModify.illustrationUrl !== "") 
        infoVerifiedToModify.illustrationUrl = infoToModify.illustrationUrl;
    if(infoToModify.numberOfCandidateToVote !== null && infoToModify.numberOfCandidateToVote !== undefined && infoToModify.numberOfCandidateToVote !== "") 
        infoVerifiedToModify.numberOfCandidateToVote = infoToModify.numberOfCandidateToVote;
    if(infoToModify.active !== null && infoToModify.active !== undefined && infoToModify.active !== "") 
        infoVerifiedToModify.active = infoToModify.active;

    //Check if there is going to have a password in the election
    if(infoToModify.confirmationPassword){
        //If yes, encrypts password
        bcrypt.hash(infoToModify.confirmationPassword, 8, (err, hash) => {
            //In case of error return callback error
            if(err) return callback(true);
            if(!hash) return callback(true);
            //Changes non encrypted password to encrypted password
            infoVerifiedToModify.confirmationPassword = hash;
            //Calls proceed function
            proceed(infoVerifiedToModify);
        });
    }else proceed(infoVerifiedToModify); //Calls proceed function with password
    // === null so it isn't set in db

    function proceed(infoToModifyInFunction){
        //Calls mongo db model to modify info
        electionsModel.findByIdAndUpdate(electionId, infoToModifyInFunction, (err, success) => {
            if(err) return callback(true);
            if(!success) return callback(true);
            if(success) return callback(false, {
                name: success.name,
                startDate: success.startDate,
                endDate: success.endDate,
                illustrationUrl: success.illustrationUrl,
                numberOfCandidateToVote: success.numberOfCandidateToVote,
            });
        });
    }
}

module.exports = {
    checkIfElectionExists,
    createElection,
    getElectionInfo,
    modifyElectionInfo
};
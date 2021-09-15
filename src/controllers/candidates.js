const {CandidateModel} = require("../models/users");
const candidate_a_election_model = require("../models/candidateInElection");
const election_controllers = require("../controllers/elections");

function allowOrNParticipation(electionId, candidateId, valueToSet, callback) {
    //Check if there is a request for this candidate
    candidate_a_election_model.findOne({
        candidateId: candidateId,
        electionParticipatingId: electionId
    }, (err, result) => {
        //Return error in case of error
        if(err) return callback(1);
        //Return not found in case request is not found
        if(!result) return callback(2);
        //Proceed in case of success
        if(result) candidate_a_election_model.findByIdAndUpdate(result._id, {
                Participating: valueToSet,
            }, (err, result2) => {
            //Return error in case of error
            if(err || !result2) return callback(1);
            //Proceed in case of success
            if(result2) return callback(false, true, valueToSet);
        });
    });
}

function checkIfThereIsRequest(electionId, candidateId, callback) {
    //Call mongo db model to find a request
    candidate_a_election_model.findOne({
        candidateId: candidateId,
        electionParticipatingId: electionId,
    }, (err, result) => {
        //In case of error 
        if(err) return callback(true);
        //In case is not found
        if(!result || result === null) return callback(false, 1);
        //In case is found
        if(result) return callback(false, 2);
    })
} 

function createRequest(electionId, candidateId, callback) {
    //Call mongo db model to create request
    CandidateModel.findById(candidateId, (err, result1) => {
        //Return error
        if(err) return callback(1);
        //If user is not found
        if(!result1) return callback(2);
        //Get election name 
        if(result1) election_controllers.getElectionInfo(electionId, 
        (err, electionInfo) => {
            //Return error
            if(err === 1) return callback(1);
            if(err === 2) return callback(3);
            //Proceed adding request
            if(electionInfo) candidate_a_election_model.create({
                candidateId: candidateId,
                electionParticipatingId: electionId,
                candidateName: result1.fullName,
                electionName: electionInfo.name
            }, (err, result2) => {
                if(err || !result2) return callback(1);
                if(result2) return callback(false, result2.candidateName);
            });
        });
        
    });
}

function getRequestInfo(electionId, candidateId, callback) {
    //Call election and candidates model to search for a request
    candidate_a_election_model.findOne({
        candidateId: candidateId,
        electionParticipatingId: electionId
    }, (err, result) => {
        //In case of internall server error
        if(err) return callback(1);
        //In case is not found
        if(!result) return callback(2);
        //In case is found return info
        if(result) return callback(false, result);
    });
}

function deleteRequest(electionId, candidateId, callback) {
    //Call election and candidates model to delete request
    candidate_a_election_model.findOneAndDelete({
        candidateId: candidateId,
        electionParticipatingId: electionId
    }, (err, result) => {
        //In case of error
        if(err) return callback(1);
        //In case request is not found
        if(!result) return callback(2);
        //In case of success
        if(result) return callback(false, true);
    });
}

function getElectionsParticipating(candidateId, callback){
    //Get elections usr is participating
    candidate_a_election_model.find({
        candidateId: candidateId
    }, (err, result) => {
        //In case of server or connection error
        if(err) return callback(1);
        //In case nothing is found
        if(!result || result.length === 0) return callback(2);
        var mappedContent = [];
        //Map only needed info
        result.forEach(content => {
            var infoToMap = {
                electionName: content.electionName,
                electionId: content.electionParticipatingId,
                requestStatus: content.Participating
            };
            mappedContent.push(infoToMap);
        });
        return callback(false, mappedContent);
    });
}

module.exports = {
    allowOrNParticipation,
    checkIfThereIsRequest,
    createRequest,
    getRequestInfo,
    deleteRequest,
    getElectionsParticipating
}; 
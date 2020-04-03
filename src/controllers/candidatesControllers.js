const electionModel = require('../models/electionsModel');
const candidateModel = require('../models/candidatesModels');

function addVote(electionID, candidateArray, callback){
    electionModel.findById(electionID, (err, success) => {
        if(err) return callback(4);
        if(!success) return callback(4);
        if(success.numberOfCandidatesToVote != candidateArray.length) return callback(2);
        var valuesSoFar = Object.create(null);
        for (var i = 0; i < candidateArray.length; ++i) {
            var value = candidateArray[i];
            if (value in valuesSoFar) {
                return callback(3);
            }
            valuesSoFar[value] = true;
        }
        candidateModel.updateMany({ _id: { $in: candidateArray }, approvedCandidate: true }, 
        { $inc: { numberOfVotes: 1 } }, 
        {multi: true}, (err, result) => {
            if(err) return callback(3);
            if(!result) return callback(1);
            if(result) return callback(false, true);
        });
    });
    //callback(1) -> 404 candidate not found
    //callback(2) -> 422 Missing or excessive candidates to vote
    //callback(3) -> 422 Repeated candidate id, you can only vote one time in each one
    //callback(4) -> 500 error
    //callback(false, result) -> success, keep on with callback, and send user id
}

function getVotes(electionID, callback){
    candidateModel.find({
        electionParticipating: electionID,
        approvedCandidate: true,
    }, (err, result) => {
        if(err) return callback(2);
        if(!result) return callback(1);
        var mapResultsArray = [];
        result.forEach((content, index) => {
            var pushToObjectArray = {
                name: content.name,
                id: content._id,
                votes: content.numberOfVotes
            }
            mapResultsArray.push(pushToObjectArray);
        });
        callback(false, mapResultsArray);
    });
    //callback(1) -> 404 election not found
    //callback(2) -> 500 error
    //callback(false, resultsArray) -> 500 error
}

function getCandidates(electionID, callback){
    candidateModel.find({
        electionParticipating: electionID,
        approvedCandidate: true,
    }, (err, result) => {
        if(err) return callback(2);
        if(!result) return callback(1);
        var mapCandidatesData = [];
        result.forEach((content, index) => {
            var candidateInfoArray = {
                name: content.name,
                age: content.age,
                id: content._id,
                text: content.message,
                profileImage: content.imgUrl,
                classNumber: content.classNumber
            }
            mapCandidatesData.push(candidateInfoArray);
        });
        return callback(false, mapCandidatesData);
    });
    //callback(1) -> 404 election not found
    //callback(2) -> 500 error
    //callback(false, candidatesArray) -> 404 election not found
}

module.exports = { 
    addVote,
    getVotes,
    getCandidates
};
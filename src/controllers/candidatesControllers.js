const electionModel = require('../models/electionsModel');
const candidateModel = require('../models/candidatesModels');

function addVote(electionID, candidateArray, callback){
    electionModel.findById(electionID, (err, success) => {
        if(err) return callback(3);
        if(!success) return callback(3);
        if(success.numberOfCandidatesToVote != candidateArray.length) return callback(2);
        candidateModel.updateMany({ _id: { $in: candidateArray } }, 
        { $inc: { numberOfVotes: 1 } }, 
        {multi: true}, (err, result) => {
            if(err) return callback(3);
            if(!result) return callback(1);
            if(result) return callback(false, true);
        });
    });
    //callback(1) -> 404 candidate not found
    //callback(2) -> 422 Invalid input 
    //callback(3) -> 500 error
    //callback(false, result) -> success, keep on with callback, and send user id
}

module.exports = { addVote };
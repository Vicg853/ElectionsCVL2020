const electionModel = require('../models/electionsModel');

function checkDate(electionID, callback){
    electionModel.findById(electionID, (err, result) => {
        if(err) return callback(3);
        if(!result) return callback(3);
        var startDate = new Date(result.startDate);
        var endDate = new Date(result.resultsDate);
        var today = new Date();
        if(startDate > today) return callback(false, 1); //Before start date
        if(endDate < today) return callback(false, 3); //After end date
        return callback(false, 2); //Between start and end date
    });
    //callback(false, 1) -> before start date
    //callback(false, 2) -> between start and end date 
    //callback(false, 3) -> after end date
    //callback(true) -> 500 error
}

function checkIfAlreadyVoted(schoolCardID, callback){
    callback(false, true);
    //callback(1) -> already voted
    //callback(2) -> 500 error
    //callback(false, true) -> did not voted yet
}

function setSchoolCardVotedElection(electionID, schoolCardID, callback){
    electionModel.updateMany({ 
        _id: electionID 
    },{
        $push: { schoolCardUserIDVotedArray: schoolCardID } 
    }, (err, result) => {
        if(err) return callback(true);
        if(!result) return callback(true);
        if(result) return callback(false, true);
    });
    //callback(true) -> 500 error
    //callback(false, true)
}

module.exports = { 
    checkDate, 
    checkIfAlreadyVoted, 
    setSchoolCardVotedElection 
};
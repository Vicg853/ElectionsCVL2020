const electionModel = require('../models/electionsModel');

function checkDate(electionID, callback){
    electionModel.findById(electionID, (err, result) => {
        if(err) return callback(true);
        if(!result) return callback(true);
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

function checkIfAlreadyVoted(schoolCardID, electionID, callback){
    electionModel.findById(electionID, (err, result) => {
        if(err) return callback(2);
        proceed = true;
        result.schoolCardUserIDVotedArray.forEach((content, index) => {
            if(content == schoolCardID) proceed = false;
        });
        if(proceed) return callback(false, true);
        else return callback(1);
    })
    //callback(1) -> already voted
    //callback(2) -> 500 error
    //callback(false, true) -> did not voted yet
}

function setSchoolCardVotedElection(electionID, schoolCardID, callback){
    electionModel.updateMany({ 
        _id: electionID 
    },{
        $push: { schoolCardUserIDVotedArray: schoolCardID },
        $inc: { totalNumberOfVotes: 1 } 
    }, (err, result) => {
        if(err) return callback(true);
        if(!result) return callback(true);
        if(result) return callback(false, true);
    });
    //callback(true) -> 500 error
    //callback(false, true)
}

function getElections(all, callback){
    electionModel.find({}, (err, result) => {
        if(err) return callback(1);
        var mapElectionsResults = [];
        result.forEach((content, index) => {
            var electionInfo = {
                id: content._id,
                name: content.electionName,
                numberOfCandidatesToVote: content.numberOfCandidatesToVote,
                endDate: content.resultsDate,
                backgroundUrl: content.backgroundUrl
            }
            if(all) mapElectionsResults.push(electionInfo);
            else {
                if(new Date(content.resultsDate) > new Date) mapElectionsResults.push(electionInfo);
            }
        });
        return callback(false, mapElectionsResults);
    });
    //callback(1) -> 500 error
    //callback(false, electionsArray) -> success, keep on with callback
}

module.exports = { 
    checkDate, 
    checkIfAlreadyVoted, 
    setSchoolCardVotedElection,
    getElections
};
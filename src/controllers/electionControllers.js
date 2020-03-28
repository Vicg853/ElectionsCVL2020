const electionModel = require('../models/electionsModel');
const adminAuthController = require('../controllers/adminAuthController');

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

function getElections(all, token, callback){
    electionModel.find({}, (err, result) => {
        if(err) return callback(2);
        var mapElectionsResults = [];
        var err = false;
        if(all){
            if(!token) return callback(3);
            adminAuthController.checkAdminAuth(token, (err, success) => {
                if(err) return callback(1);
                if(!success) return callback(2);
                result.forEach((content, index) => {
                    var electionInfo = {
                        id: content._id,
                        name: content.electionName,
                        endDate: content.resultsDate,
                        startDate: content.startDate,
                        backgroundUrl: content.backgroundUrl
                    }
                    mapElectionsResults.push(electionInfo);
                });  
                return callback(false, mapElectionsResults);
            });
        } else {
            result.forEach((content, index) => {
                var electionInfo = {
                    id: content._id,
                    name: content.electionName,
                    endDate: content.resultsDate,
                    startDate: content.startDate,
                    backgroundUrl: content.backgroundUrl
                }
                if(new Date(content.resultsDate) > new Date 
                    && new Date(content.startDate) < new Date) mapElectionsResults.push(electionInfo);
            });  
            return callback(false, mapElectionsResults);
        }
    });
    //callback(1) -> 500 error
    //callback(false, electionsArray) -> success, keep on with callback
}

function getElectionInfo(electionID, token, callback){
    electionModel.findOne({
        _id: electionID,
    }, (err, res) => {
        if(err) return callback(3);
        if(!res) return callback(1);
        var electionInfo = {
            id: res._id,
            name: res.electionName,
            endDate: res.resultsDate,
            startDate: res.startDate,
            backgroundUrl: res.backgroundUrl
        }
        if(new Date(res.resultsDate) > new Date 
            && new Date(res.startDate) < new Date) return callback(false, electionInfo);
        else{
            if(!token) return callback(4);
            adminAuthController.checkAdminAuth(token, (err, success) => {
                if(err) return callback(2);
                if(!success) return callback(3);
                return callback(false, electionInfo);
            });
        }   
    });
}

module.exports = { 
    checkDate, 
    checkIfAlreadyVoted, 
    setSchoolCardVotedElection,
    getElections,
    getElectionInfo
};
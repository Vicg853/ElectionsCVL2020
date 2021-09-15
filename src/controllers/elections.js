const bcrypt = require("bcrypt");
const electionsModel = require("../models/elections");
const candidate_a_elections = require("../models/candidateInElection");

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

function checkIfIsElectionCreator(authorId, electionId, callback){
    //Call mongo db model 
    electionsModel.findOne({
        _id: electionId,
    }, (err, result) => {
        //In case of error
        if(err) return callback(1);
        //If not found 
        if(!result) return callback(2);
        //In case is found check if authorId passed corresponds to the
        //authorId in the db and returns 
        //Return false in case is does not corresponds
        if(result.authorID !== authorId) return callback(false, false);
        //else return true
        else return callback(false, true);
    });
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
    electionsModel.findOne({_id: electionId}, (err, success) => {
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
            NeedsPassword: password,
            active: success.active
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
            //In case of error
            if(err) return callback(true);
            //In case of error
            if(!success) return callback(true);
            if(success) electionsModel.findOne({
                _id: electionId
            }, (err, result) => {
                //In case of error
            if(err) return callback(true);
            //In case of error
            if(!success) return callback(true);
            });
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

function deleteElection(electionId, callback) {
    electionsModel.findByIdAndDelete(electionId, (err, success) => {
        if(err || !success) return callback(true);
        if(success) return callback(false, true);
    });
}

function checkElectionStatus(electionId, callback) {
    //Call mongo db model to get info and then check date
    electionsModel.findById(electionId, (err, result) => {
        //In case of error
        if(err) return callback(1);
        //In case election is not found
        if(!result) return callback(2);
        //Getting dates in a format JS will understand
        var startDate = result.startDate;
        var endDate = result.endDate;
        var today = new Date()/1000;
        
        //Not started yet
        if(today < startDate) return callback(false, 1, result.active);

        //Occurring
        if(startDate <= today && today <= endDate) return callback(false, 2, result.active);

        //Ended
        if(endDate < today) return callback(false, 3, result.active);
    });
}

function getElectionsExtended(authorId, callback){
    //Call elections mongo db model to get info
    electionsModel.find((err, result) => {
        //In case of error
        if(err) return callback(1);
        //In case results are empty
        if(!result || result.length === 0) return callback(2);
        //In case there is map results
        var electionsMap = [];
        //For each function that map all results
        result.forEach(content => {
            //Check if there is a password to verify
            //or not and set password needed in function of that
            var passwordNeeded = true
            if(!content.confirmationPassword ||
                content.confirmationPassword === null || 
                content.confirmationPassword === undefined ||
                content.confirmationPassword === "") passwordNeeded = false;
            //Array with info about election 
            var electionInfoArray = {
                electionId: content._id,
                name: content.name,
                authorName: content.authorName,
                authorID: content.authorID,
                startDate: content.startDate,
                endDate: content.endDate,
                illustrationUrl: content.illustrationUrl,
                numberOfCandidateToVote: content.numberOfCandidateToVote,
                needsConfirmationPassword: passwordNeeded,
                active: content.active,
                numberOfTotalVotes: content.numberOfTotalVotes
            };
            //Get only own author elections
            //if needed
            if(content.authorID === authorId || !authorId) 
                electionsMap.push(electionInfoArray);
        });
        //Check if results are empty
        if(electionsMap.length === 0) return callback(2);
        //Return results
        return callback(false, electionsMap);
    });
}

function getElectionInfoExtended(authorId, electionId, callback) {
    //Election model that is going to get the election info
    electionsModel.findOne({
        _id: electionId, 
        authorID: authorId
    }, (err, result) => {
        //Return error in case of error
        if(err) return callback(1);
        //Return not found in case election is not found
        if(!result) return callback(2);
        //Array to return info
        var passwordNeeded = true;
        if(!result.confirmationPassword || result.confirmationPassword === null ||
            result.confirmationPassword === undefined || result.confirmationPassword === "") passwordNeeded = false;
            
        var infoArray = {
            name: result.name,
            authorName: result.authorName,
            authorID: result.authorID,
            startDate: result.startDate,
            endDate: result.endDate,
            illustrationUrl: result.illustrationUrl,
            numberOfCandidateToVote: result.numberOfCandidateToVote,
            passwordNeeded: result.passwordNeeded,
            active: result.active,
            numberOfTotalVotes: result.numberOfTotalVotes,
            voters: result.voters,
        }
        //Return info in case of success
        if(result) return callback(false, infoArray);
    });
}

function getElections(callback){
    //Get elections 
    electionsModel.find({active: true}, (err, result) => {
        //Return error
        if(err) return callback(1);
        //Check if there are elections, if not return empty
        if(!result || result.length === 0) return callback(2);
        //Map results variable
        var mapInfoArray = [];
        //Mapping array of info
        result.forEach(content => {
            var infoArray = {
                electionId: content._id,
                name: content.name,
                authorName: content.authorName,
                endDate: content.endDate,
                illustrationUrl: content.illustrationUrl
            };
            var today = new Date()/1000;
            //Check if has started
            if(content.startDate <= today) mapInfoArray.push(infoArray);
        });
        //Return elections
        if(result) return callback(false, mapInfoArray);
    });
}

function electionResults(electionId, callback) {
    //Call mongo db model to get
    electionsModel.findOne({
        _id: electionId,
        active: true,
    }, (err, result) => {
        //In case of error
        if(err) return callback(1);
        //If no election is found
        if(!result) return callback(2);
        //In case there is an election, check it's end date
        if(result) {
            //Getting dates
            var startDate = result.startDate;
            var endDate = result.endDate;
            var today = new Date()/1000;
            //In case hasn't started or is ongoing yet
            if(today < startDate) return callback(3);
            if(startDate <= today && today <= endDate) return callback(3);
            //In case ended, proceed
            var infoArray = {
                name: result.name,
                authorName: result.authorName,
                startDate: result.startDate,
                endDate: result.endDate,
                illustrationUrl: result.illustrationUrl,
                numberOfCandidateToVote: result.numberOfCandidateToVote,
                numberOfTotalVotes: result.numberOfTotalVotes,
                candidatesResults: []
            };
            if(endDate < today) candidate_a_elections.find({
                electionParticipatingId: electionId,
                Participating: true,
            }, (err, result2) => {
                //In case of error
                if(err) return callback(1);
                //If no candidates are found
                if(!result2 || result2.length === 0) return callback(4);
                //Proceed creating object with candidates and votes
                //Candidates map
                var candidatesResultsMap = [];
                //Mapping candidates info
                result2.forEach(content => {
                    var infoArray = {
                        candidateId: content.candidateId,
                        candidateName: content.candidateName,
                        NumberOfVotes: content.NumberOfVotes
                    };
                    candidatesResultsMap.push(infoArray);
                });
                infoArray.candidatesResults = candidatesResultsMap;
                if(result2) return callback(false, infoArray);
            });
        }
    });
}

function voteInElection(electionId, candidatesVotedArray, voterUsername, callback){
    candidate_a_elections.find({
        electionParticipatingId: electionId,
        Participating: true,
    }, (err, candidatesArray) => {
        //In case of error
        if(err) return callback(1);
        //If no candidates are found
        if(!candidatesArray || candidatesArray.length === 0) return callback(2);
        //In case all goes as expected check if candidates 
        //voted exists
        if(candidatesArray) {
            //Check if all candidates are valid
            var candidatesIdArray = [];
            candidatesArray.forEach(content => {
                candidatesIdArray.push(content.candidateId);
            });

            //Check if candidates to vote var is really an array
            var candidatesVotedArrayToCheck = [];
            if(Array.isArray(candidatesVotedArray)) 
                candidatesVotedArrayToCheck = candidatesVotedArray;
            else candidatesVotedArrayToCheck.push(candidatesVotedArray);

            //Run through all candidates and check if they are valid
            if(!candidatesArray.some(content => {
                if(candidatesIdArray.indexOf(content) > -1) return true;
            })) {
                //Check if there are no repeated candidates being voted
                var valuesSoFar = Object.create(null);
                if(!candidatesVotedArrayToCheck.some((content, i) => {
                    var value = candidatesVotedArray[i];
                    if(value in valuesSoFar) return true;
                    valuesSoFar[value] = true;
                })) proceed();
                //In case there is a repeated candidate value
                else return callback(4);    
            }
            //In case there is an invalid candidateId to vote
            else return callback(3);
        }
        //Proceed to voting function
        function proceed(){
            candidateModel.updateMany({ 
                candidateId: { $in: candidateArray }, 
                Participating: true, 
                electionParticipatingId: electionId 
            }, 
            { $inc: { NumberOfVotes: 1 } }, 
            {multi: true}, (err, voted) => {
                //In case of error
                if(err || !voted) return callback(1);
                //In case all goes right set already voted voter
                if(voted) electionsModel.findByIdAndUpdate(electionId, {
                    $push: { voters: voterUsername }
                }, (err, addedVoter) => {
                    //In case of error
                    if(err || !addedVoter) return callback(1);
                    //Return success finally
                    if(addedVoter) return callback(false, true);
                });
            });
        }
    });
} 

function checkElectionPassword(passwordToCheck, password, callback){
    bcrypt.compare(password, passwordToCheck, (err, correct) => {
        //Return error
        if(err) return callback(1);
        //In case is not correct
        if(!correct) return callback(2);
        //In case password is correct 
        if(correct) return callback(false, true);
    });
}  

function getElectionFullInfo(electionId, callback) { 
    //Var that will be sent to check if need to input password
    var password = true;
    //Mongo DB model that gets election info
    electionsModel.findOne({_id: electionId}, (err, success) => {
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
            NeedsPassword: password,
            confirmationPassword: success.confirmationPassword,
            active: success.active,
            voters: success.voters,
            numberOfTotalVotes: success.numberOfTotalVotes
        });
    });
}

module.exports = {
    checkIfElectionExists,
    createElection,
    getElectionInfo,
    modifyElectionInfo,
    deleteElection,
    checkElectionStatus,
    getElectionsExtended,
    checkIfIsElectionCreator,
    getElectionInfoExtended,
    getElections,
    electionResults,
    checkElectionPassword,
    getElectionFullInfo,
    voteInElection
};
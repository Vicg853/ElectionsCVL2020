const bcrypt = require("bcrypt");
const {UserModel, CandidateModel} = require("../../models/users");

function createCandidate(infoArray, callback) {
    //Checks if password has been inputted so hash runs correctly
    if(!infoArray.password) return callback(2);
    //Checks if there already an user with this username
    CandidateModel.findOne({
        username: infoArray.username
    }, (err, found) => {
        //Return error in case of error
        if(err) return callback(1);
        //Returns that user already exists
        if(found) return callback(3);
        //In case not found proceed encrypting password
        if(!found) bcrypt.hash(infoArray.password, 13, (err, hash) => {
            //Return error in case of error
            if(err) return callback(1);
            if(!hash) return callback(1);
            //Set password to encrypted password
            infoArray.password = hash;
            //Creates user
            if(hash) CandidateModel.create(infoArray, (err, success) => {
                //Returns error in case of an error
                //while creating user
                if(err) return callback(1);
                if(!success) return callback(1);
                //Creates an array to show saved data in case of success
                var infoCreatedArray = {
                    fullName: success.fullName,
                    mailAddress: success.mailAddress,
                    blocked: success.blocked,
                    age: success.age,
                    message: success.message,
                    imgUrl: success.imgUrl,
                    classNumber: success.classNumber,
                };
                //Returns success and data array 
                if(success) return callback(false, infoCreatedArray);
            });
        });
    });
    //callback(1) --> 500
    //callback(2) --> missing password value
    //callback(3) --> user already exists
}

function changeCandidateInfo(userId, infoArray, callback){
    //Mongo db function to update user info
    CandidateModel.findByIdAndUpdate(userId, { $set: infoArray }, (err, res) => {
        //Returns error in case of internal server errors
        if(err) return callback(true);
        if(!res) return callback(true);
        //Returns user full name in case of success
        return callback(false, res.fullName);
    });
    //callback(true) --> 500 
}

function modifyCandidatePassword(userId, newPassword, callback){
    bcrypt.hash(newPassword, 13, (err, hash) => {
        if(err) return callback(1);
        if(!hash) return callback(1);
        if(hash) CandidateModel.findByIdAndUpdate(userId, {
            $set: { password: hash }
        }, (err1, result) => {
            if(err1) return callback(1);
            if(!result) return callback(2);
            if(result) return callback(false, true);
        });
    });
    //callback(1) --> 500
    //callback(2) --> user not found 
}

function deleteCandidate(userId, callback) {
    CandidateModel.findByIdAndDelete(userId, (err, res) => {
        if(err) return callback(true);
        if(!res) return callback(true);
        else return callback(false, res.fullName);
    });
    //callback(true) --> 500
}

function blockOrUnblockCandidate(userId, value, callback) {
    //Checks if user really exists
    CandidateModel.findById(userId, (err, found) => {
        //Returns 500 in case of internal server error
        if(err) return callback(1);
        //Returns 404 user not found
        if(!found) return callback(2);
        //In case that usr is found modify the blocked status
        //to chosen value by user
        if(found) CandidateModel.findByIdAndUpdate(userId, {
            $set: { blocked: value }
        }, (err, modified) => {
            //Returns 500 in case of internal server error
            if(err) return callback(1);
            if(!modified) return callback(1);
            //Returns new blocked value and err === false
            if(modified && !value) return callback(false, true, "unblocked");
            if(modified && value) return callback(false, true, "blocked");
        });
    });
    //callback(1) --> 500
    //callback(2) --> user not found
}

module.exports = {
    createCandidate,
    changeCandidateInfo,
    deleteCandidate,
    modifyCandidatePassword,
    blockOrUnblockCandidate
};
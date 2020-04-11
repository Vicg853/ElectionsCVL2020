const bcrypt = require("bcrypt");
const {UserModel, CandidateModel} = require("../../models/users");

function checkLoginCredentials(username, password, callback) {
    //Check if user exist
    CandidateModel.findOne({
        username: username
    }, (err, res) => {
        //Return error in case of internal server error
        if(err) return callback(1);
        //Returns user does not exist in case username is not found
        if(!res) return callback(2);
        if(!res._id) return callback(2);
        //Checks if user is not blocked
        if(res.blocked) return callback(3);
        //Checks if password is correct
        bcrypt.compare(password, res.password, (err, match) => {
            //Returns error in case of internal server error
            if (err) return callback(1);
            //Returns wrong password in case of wrong password
            if (!match) return callback(2);
            //Make little array with needed user info
            var userInfo = {
                userId: res._id,
                fullName: res.fullName,
                scopes: res.scopes,
            };
            //Returns error null and some user info
            return callback(false, userInfo);
        });
    });
    //callback(1) -> 500
    //callback(2) -> user not found or incorrect password
    //callback(3) -> 401 usr blocked
}

function checkCandidatePassword(candidateId, passwordToVerify, callback){
    CandidateModel.findById(candidateId, (err, res) => {
        if(err) return callback(1);
        if(!res) return callback(2)
        if(!res._id) return callback(2);
        if(res.blocked) return callback(3);
        bcrypt.compare(passwordToVerify, res.password, (err, match) => {
            if (err) return callback(1);
            if (!match) return callback(4);
            return callback(false, true);
        });
    });
    //callback(1) --> 500
    //callback(2) --> user not found
    //callback(3) --> user blocked
    //callback(4) --> wrong password
}

module.exports = {
    checkLoginCredentials,
    checkCandidatePassword
};
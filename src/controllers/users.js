const bcrypt = require("bcrypt");
const {UserModel, CandidateModel} = require("../models/users");

function createAdmin(
    infoArray,
    callback) {
    //Check if password and password confirm are the same
    //returns error in case it is
    if(infoArray.password !== infoArray.newUserPasswordConfirm) return callback(1);
    //Set confirm password to undefined so it isn't save in db
    else infoArray.newUserPasswordConfirm = undefined;
    //Checks if scopes is an array
    //and if not transforms it in an array
    if(!Array.isArray(infoArray.scopes)) infoArray.scopes = [infoArray.scopes];
    //Search in db if this username is already in use
    UserModel.findOne({
        username: infoArray.username
    }, (err, found) => {
        //Returns error in case of error
        if(err) return callback(2);
        //Returns already exists 
        if(found) return callback(3);
        //Encrypts then the password before saving user info
        if(!found) bcrypt.hash(infoArray.password, 13, (err, hash) => {
            //Returns error in case of an error
            if(err) return callback(2);
            if(!hash) return callback(2);
            //Proceeds
            if(hash) {
                //Sets password to hashed password
                infoArray.password = hash;
                //Adds user to db with data
                UserModel.create(infoArray, (err, created) => {
                    //Returns error in case of error
                    if(err) return callback(2);
                    if(!created) return callback(2);
                    if(created) return callback(false, created.fullName);
                });
            }
        });
    });
    //callback(1) --> passwords confirmation must be equal
    //callback(2) --> internal server error 
    //callback(3) --> this username or email is already in use
}

function changeUserInfo(userId, infoArray, callback){
    //Setting info array to prevent to update to null
    var infoArrayToUpdate = {};

    if (infoArray.fullName) infoArrayToUpdate.fullName = infoArray.fullName;
    if (infoArray.mailAddress) infoArrayToUpdate.mailAddress = infoArray.mailAddress;
    if (infoArray.scopes || infoArray.scopes.length !== 0) infoArrayToUpdate.scopes = infoArray.scopes;
    
    infoArrayToUpdate = { $set: infoArrayToUpdate }

    UserModel.findByIdAndUpdate(userId, infoArrayToUpdate, (err, res) => {
        if(err) return callback(true);
        if(!res) return callback(true);
        return callback(false, res.fullName);
    });
    //callback(true) --> 500 
}

function getUserInfo(userId, callback){
    UserModel.findById(userId, (err, res) => {
        if(err) return callback(1);
        if(!res) return callback(2);
        var userInfoArray = {
            username: res.username,
            fullName: res.fullName,
            scopes: res.scopes,
            mailAddress: res.mailAddress,
            userMetadata: res.userMetadata,
            blocked: res.blocked
        };
        return callback(false, userInfoArray);
    });
    //callback(1) --> 500
    //callback(2) --> user not found
}

function modifyUserPassword(userId, newPassword, callback){
    bcrypt.hash(newPassword, 13, (err, hash) => {
        if(err) return callback(1);
        if(!hash) return callback(1);
        if(hash) UserModel.findByIdAndUpdate(userId, {
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

function deleteUser(userId, callback) {
    UserModel.findByIdAndDelete(userId, (err, res) => {
        if(err) return callback(true);
        if(!res) return callback(true);
        else return callback(false, true);
    });
    //callback(true) --> 500
}

function blockOrUnblockUser(userId, value, callback) {
    //Checks if user really exists
    UserModel.findById(userId, (err, found) => {
        //Returns 500 in case of internal server error
        if(err) return callback(1);
        //Returns 404 user not found
        if(!found) return callback(2);
        //In case that usr is found modify the blocked status
        //to chosen value by user
        if(found) UserModel.findByIdAndUpdate(userId, {
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
    createAdmin,
    getUserInfo,
    changeUserInfo,
    deleteUser,
    modifyUserPassword,
    blockOrUnblockUser
};
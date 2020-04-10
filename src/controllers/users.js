const bcrypt = require("bcrypt");
const {UserModel, CandidateModel} = require("../models/users");

function createAdmin(
    username, 
    password, 
    passwordConfirm,
    fullName, 
    role, 
    mailAddress,
    callback) {
    var newRoleArray = [];
    if(Array.isArray(role)) newRoleArray = role;
    else newRoleArray.push(role);
    if(password !== passwordConfirm) return callback(1);
    UserModel.find({
        username: username, 
    },(err, res) => {
        if(err) return callback(2);
        if(res.length > 0) return callback(3);
        bcrypt.hash(password, 13, (err, hash) => {
            if(err) return callback(2);
            if(!hash) return callback(2);
            UserModel.create({
                username: username,
                password: hash,
                fullName: fullName,
                scopes: newRoleArray,
                mailAddress: mailAddress,
                userMetadata: [],
                blocked: 0,
            }, (err, res1) => {
                if(err) return callback(2);
                if(!res1) return callback(2);
                return callback(false, res1.fullName);
            });
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
    if (infoArray.blocked !== null) infoArrayToUpdate.blocked = infoArray.blocked;
    
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

module.exports = {
    createAdmin,
    getUserInfo,
    changeUserInfo,
    deleteUser,
    modifyUserPassword
};
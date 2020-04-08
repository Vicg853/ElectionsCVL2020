const bcrypt = require("bcrypt");
const {UserModel, CandidateModel} = require("../models/users");

function checkLoginCredentials(username, password, callback) {
    UserModel.findOne({
        username: username
    }, (err, res) => {
        if(err) return callback(1);
        if(!res) return callback(2);
        if(!res._id) return callback(2);
        if(res.blocked) return callback(3);
        bcrypt.compare(password, res.password, (err, match) => {
            if (err) return callback(1);
            if (!match) return callback(2);
            var userInfo = {
                userId: res._id,
                fullName: res.fullName,
                scopes: res.scopes,
            };
            return callback(false, userInfo);
        });
    });
    //callback(1) -> 500
    //callback(2) -> user not found or incorrect password
    //callback(3) -> 401 usr blocked
}

function checkScopes(userScopes, authorizedScopes, callback) {
    var userScopesArray = [];
    var authorizedScopesArray = [];
    if(userScopes !== typeof Array) userScopesArray.push(userScopes);
    else userScopesArray = userScopes;
    if (authorizedScopes !== typeof Array) authorizedScopesArray.push(authorizedScopes);
    else authorizedScopesArray = authorizedScopes;
    callback(userScopesArray.some(element => {
        if(authorizedScopesArray.indexOf(element) >= 0) return true;
    }));
}

function checkAdminPassword(adminId, passwordToVerify, callback){
    UserModel.findById(adminId, (err, res) => {
        if(err) return callback(1);
        if(!res) return callback(2)
        if(!res._id) return callback(2);
        if(res.blocked) return callback(3);
        bcrypt.compare(password, res.password, (err, match) => {
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
    checkScopes,
    checkAdminPassword
};
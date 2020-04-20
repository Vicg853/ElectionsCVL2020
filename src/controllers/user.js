const {UserModel} = require("../models/users");
const electionModel = require("../models/elections");

function getAdminInfo(userId, callback){
    //Calls mongo db model and searches user by id
    UserModel.findById(userId, (err, queryRes) => {
        if(err) return callback(true);
        if(!queryRes) return callback(true);
        if(queryRes) return callback(false, {
            name: queryRes.fullName,
            scopes: queryRes.scopes,
            emailAddress: queryRes.mailAddress,
            blocked: queryRes.blocked,
        });
    });
}

function voterCredentialsCheck(username, password, callback) {
    //return callback(1); internal server error
    //return callback(2); already voted
    //return callback(3); wrong password or username not found
    electionModel.find
    return callback(false, true);
}

module.exports = {
    getAdminInfo,
    voterCredentialsCheck
}
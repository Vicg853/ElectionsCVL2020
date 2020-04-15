const {UserModel} = require("../models/users");

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

module.exports = {
    getAdminInfo,
}
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
    if(role === typeof Array) newRoleArray = req.newRole;
    else newRoleArray.push(role);
    if(password !== passwordConfirm) return callback(1);
    UserModel.find({$or: [
        {username: username}, 
        {mailAddress: mailAddress}
    ]},(err, res) => {
        if(err) return callback(2);
        if(res.length > 0) return callback(3);
        bcrypt.hash(password, 13, (err, hash) => {
            if(err) return callback(2);
            if(!hash) return callback(2);
            UserModel.create({
                username: username,
                password: hash,
                fullName: fullName,
                role: newRoleArray,
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

module.exports = {createAdmin};
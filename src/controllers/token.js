const jwt = require("jsonwebtoken");
const fs = require("fs"),
      path = require('path'),
      filePath = path.join(__dirname, "../../");

const tokenBlackListModel = require("../models/tokenList");

var privateKEY  = fs.readFileSync(filePath + 'private.pem', 'utf8');
var publicKEY  = fs.readFileSync(filePath + 'public.pem', 'utf8');

function generateToken(data, callback){
    const jwtOptions = {
        expiresIn: "2h",
        algorithm: "RS512",
    };
    jwt.sign(data, privateKEY, jwtOptions,(err, success) => {
        if(err) return callback(true);
        if(!success) return callback(true);
        return callback(false, success);
    });
}

function checkToken(token, callback){
    jwt.verify(token, publicKEY, { algorithms:  ["RS512"] },(err, decoded) => {
        if(err) return callback(2);
        if(!decoded) return callback(2); 
        tokenBlackListModel.findOne({
            token: token,
            userId: decoded.userId
        }, (err, res) => {
            if(err) return callback(1);
            if(res) return callback(2);
            return callback(false, decoded);
        });
    });
    //callback(1) --> 500
    //callback(2) --> token not valid
}

function invalidateToken(token, tokenPayload, callback){
    tokenBlackListModel.create({
        token: token,
        expireDate: tokenPayload.exp,
        userId: tokenPayload.userId
    }, (err, res) => {
        if(err) return callback(true);
        if(!res) return callback(true);
        return callback(false, true);
    });
}

module.exports = {
    generateToken, 
    checkToken, 
    invalidateToken
};
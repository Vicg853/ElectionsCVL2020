const jwt = require("jsonwebtoken");
const fs = require("fs"),
      path = require('path'),
      filePath = path.join(__dirname, "../../");

const tokenBlackListModel = require("../models/tokenList");
const {UserModel, CandidateModel} = require("../models/users");

const utilsControllers = require("./utils");

var publicKEY  = fs.readFileSync(filePath + 'public.pem', 'utf8');

function checkAdminToken(token, checkInfoOrN, callback){
    jwt.verify(token, publicKEY, { algorithms:  ["RS512"] },(err, decoded) => {
        if(err) return callback(2);
        if(!decoded) return callback(2); 
        tokenBlackListModel.findOne({
            token: token,
            userId: decoded.userId
        }, (err, res) => {
            if(err) return callback(1);
            if(res) return callback(2);
            if(!res && checkInfoOrN) UserModel.findById(decoded.userId, (err, res) => {
                if(err) return callback(1);
                if(!res) return callback(2);
                if(res.blocked) return callback(2);
                if(decoded.fullName !== res.fullName) return callback(2);
                if(!utilsControllers.arraysMatch(decoded.scopes, res.scopes)) return callback(2);
                return callback(false, decoded);
            });
            if(!res && !checkInfoOrN) return callback(false, decoded);
        });
    });
    //callback(1) --> 500
    //callback(2) --> token not valid
}

function checkCandidateToken(token, checkInfoOrN, callback){
    jwt.verify(token, publicKEY, { algorithms:  ["RS512"] },(err, decoded) => {
        if(err) return callback(2);
        if(!decoded) return callback(2); 
        tokenBlackListModel.findOne({
            token: token,
            userId: decoded.userId
        }, (err, res) => {
            if(err) return callback(1);
            if(res) return callback(2);
            if(!res && checkInfoOrN) CandidateModel.findById(decoded.userId, (err, res) => {
                if(err) return callback(1);
                if(!res) return callback(2);
                if(res.blocked) return callback(2);
                if(decoded.fullName !== res.fullName) return callback(2);
                if(!utilsControllers.arraysMatch(decoded.scopes, res.scopes)) return callback(2);
                return callback(false, decoded);
            });
            if(!res && !checkInfoOrN) return callback(false, decoded);
        });
    });
    //callback(1) --> 500
    //callback(2) --> token not valid
}

function checkIfIsCandidate(token, callback) {
    var decoded = jwt.decode(token, {complete: true});
    if(!decoded.payload) return callback(true);
    else {
        if(decoded.payload.scopes)
        var scopes = [];
        if (!Array.isArray(decoded.payload.scopes)) scopes.push(decoded.payload.scopes);
        else scopes = decoded.payload.scopes;
        callback(false, scopes.some(element => {
            if(element === "role:candidate") return element;
        }));
    }
}

module.exports = {
    checkAdminToken, 
    checkCandidateToken,
    checkIfIsCandidate
};
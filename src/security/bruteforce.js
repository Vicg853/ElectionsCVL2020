const ExpressBrute = require('express-brute'), moment = require('moment');
const MongooseStore = require("express-brute-mongoose");
const BruteForceSchema = require("express-brute-mongoose/dist/schema");
const mongoose = require("mongoose");

//Error sent when there are to many login attempts or etc...
const failCallback = function (req, res, nextValidRequestDate) {
    return res.status(403).json({
       code: "403",
       msg: "You tried to many times with the same credentials try again in " + moment(nextValidRequestDate).fromNow()
    });
}
    //Brute force store 
const model = mongoose.model(
  "bruteforce",
  new mongoose.Schema(BruteForceSchema)
);
const store = new MongooseStore(model);
      
const userBruteforce = new ExpressBrute(store, {
    freeRetries: 11,
    minWait: 2*60*1000, // 2 minutes
    maxWait: 60*60*1000, // 1 hour,
    failCallback: failCallback
});
    // No more than 400 login attempts per day per IP
const globalBruteforce = new ExpressBrute(store, {
    freeRetries: 500,
    attachResetToRequest: false,
    refreshTimeoutOnRequest: false,
    minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
    maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
    lifetime: 24*60*60, // 1 day (seconds not milliseconds)
    failCallback: failCallback
});
    
module.exports = {userBruteforce, globalBruteforce};
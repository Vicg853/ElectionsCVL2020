const routerElectionEdit = require("express").Router();

const {
    mainHost,
    rootRoute,
    loginRoute,
    adminPanelRoute,
    logoutRoute
} = require("../urls");

const tokenControllers = require("../controllers/token");
const authControllers = require("../controllers/auth");
const electionControllers = require("../controllers/elections");
const usersControllers = require("../controllers/user");

routerElectionEdit.post(rootRoute + "/create", (req, res) => {
    //Check if input is missing
    if(!req.body.infoArray || !req.body.infoArray.name ||
        !req.body.infoArray.startDate || !req.body.infoArray.endDate ||
        !req.body.infoArray.numberOfCandidateToVote) return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Checks if session or token is missing
    if(!req.session.token) return res.redirect(401, mainHost + loginRoute);
    //Check if client is a candidate or administrator
    tokenControllers.checkIfIsCandidate(req.session.token, (err, isCandidate) => {
        //Return 500 in case of internal server error
        if(err) return res.status(500).json({msg: "Internal sever error!", code: "500"});
        //If is a candidate returns 403 ad only admin have access to this
        if(isCandidate) return res.status(403).json({msg: "You must be an administrator to do this action!", code: "403"});
        //If not proceed
        if(!isCandidate) tokenControllers.checkAdminToken(req.session.token, true, (err, tokenPayload) => {
            if(err) { 
                //Return 500 in case of internal server error
                //or redirects to logout page in case of invalid token
                if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                if(err === 2) return res.redirect(401, mainHost + logoutRoute);
            }
            if(tokenPayload) {
                //Defining needed scopes to proceed
                var authorizedScopes = ["election:add_a_edit_a_delete", "role:master", "election:admin"];
                //Checks if has administrator access if hasn't returns 403
                if(tokenPayload && !authControllers.checkScopes(tokenPayload.scopes, authorizedScopes))
                    return res.status(403).json({msg: "You must have admin access!", code: "403"});
                //In case has one of the scopes
                if(tokenPayload && authControllers.checkScopes(tokenPayload.scopes, authorizedScopes)){
                    var query = {
                        name: req.body.infoArray.name,
                        authorID: tokenPayload.userId
                    }
                    electionControllers.checkIfElectionExists(query, (err, result) => {
                        //Return 500 in case of internal server error
                        if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                        if(result) return res.status(409).json({msg: "Election with the same name found!", code: "409"});
                        if(err === 2) return proceed(tokenPayload);
                    });
                }
            }
        });
    });
    //Function that actually creates election
    function proceed(tokenPayload) {
        //Gets admin info so can save data in db
        usersControllers.getAdminInfo(tokenPayload.userId, (err, result) => {
            //Return 500 in case of internal server error
            if(err || !result) return res.status(500).json({msg: "Internal server error!", code: "500"});
            //Proceed
            if(result) {
                //Convert date to javascript date
                var convertStartDate = new Date(req.body.infoArray.startDate);
                var convertEndDate = new Date(req.body.infoArray.endDate);
                //Check if dates are valid
                //if not returns 422
                if(isNaN(convertStartDate) || isNaN(convertEndDate)) return res.status(422).json({msg: "Wrong date format or date is invalid, date format must be MM/DD/YYYY", code: "422"});
                //Convert date to UnixTimeStamp
                var UnixDateStartDate = convertStartDate/10000;
                var UnixDateEndDate = convertEndDate/10000;

                if(UnixDateStartDate >= UnixDateEndDate) return res.status(409).json({msg: "Start date must be before end date!", code: "409"});

                //Set variables in array to create election
                var infoToCreateArray = {
                    name: req.body.infoArray.name,
                    authorName: result.name,
                    authorID: tokenPayload.userId,
                    startDate: UnixDateStartDate,
                    endDate: UnixDateEndDate,
                    illustrationUrl: req.body.infoArray.illustrationUrl,
                    numberOfCandidateToVote: req.body.infoArray.numberOfCandidateToVote,
                    confirmationPassword: req.body.infoArray.confirmationPassword,
                    active: true
                };
                //Calls controller to handle election creation
                electionControllers.createElection(infoToCreateArray, (err, success) => {
                    //Return 500 in case of internal server error
                    if(err || !success) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    //In case of success returns 200 and a little preview of data 
                    //that has been saved to db
                    if(success) return res.status(200).json({msg: "Success creating elections!", code: "200", preview: success});
                });
            }
        });
    }
});


routerElectionEdit.put(rootRoute + "/edit", (req, res) => {
    //Check if input is missing
    if(!req.body.infoArray || !req.body.electionId) 
        return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Checks if session or token is missing
    if(!req.session.token) return res.redirect(401, mainHost + loginRoute);
    //Check if client is a candidate or administrator
    tokenControllers.checkIfIsCandidate(req.session.token, (err, isCandidate) => {
        //Return 500 in case of internal server error
        if(err) return res.status(500).json({msg: "Internal sever error!", code: "500"});
        //If is a candidate returns 403 ad only admin have access to this
        if(isCandidate) return res.status(403).json({msg: "You must be an administrator to do this action!", code: "403"});
        //If not proceed
        if(!isCandidate) tokenControllers.checkAdminToken(req.session.token, true, (err, tokenPayload) => {
            if(err) { 
                //Return 500 in case of internal server error
                //or redirects to logout page in case of invalid token
                if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                if(err === 2) return res.redirect(401, mainHost + logoutRoute);
            }
            //Check if election exists
            if(tokenPayload) electionControllers.checkIfElectionExists({_id: req.body.electionId}, (err, result1) => {
                if(err) {
                    //Return 500 in case of internal server error
                    //or 404 for an not found election
                    if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                    if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
                }
                if(result1){
                    //Defining needed scopes to proceed
                    var authorizedScopes = ["role:master", "election:admin"];
                    //Checks if has master or admin access 
                    if(tokenPayload && !authControllers.checkScopes(tokenPayload.scopes, authorizedScopes)) 
                        //If hasn't check if is election owner and still
                        //has add, edit and delete elections access
                        //but before gets lection info to check author id 
                        electionControllers.getElectionInfo(req.body.electionId, (err, result2) => {
                            if(err) {
                                //Return 500 in case of internal server error
                                //or 404 for an not found election
                                if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                                if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
                            }
                            //Checks if is the author and if user still is
                            //allowed to add, edit and delete
                            if(result2.authorID === tokenPayload.userId && authControllers.checkScopes(tokenPayload.scopes, "election:add_a_edit_a_delete")) 
                                proceed(result2);
                            else return res.status(403).json({msg: "You are not authorized to edit this election!", code: "403"});
                    });
                    //If has proceed
                    else electionControllers.getElectionInfo(req.body.electionId, (err, result2) => {
                        proceed(result2);
                    });
                }
            });
        });
    });
    //Function that actually edits election
    function proceed(electionInfo) {
        if(req.body.infoArray.startDate !== null && req.body.infoArray.startDate !== undefined
            && req.body.infoArray.startDate !== ""){
            //Convert date to javascript date
            var convertStartDate = new Date(req.body.infoArray.startDate);
            //Check if dates are valid
            //if not returns 422
            if(isNaN(convertStartDate)) return res.status(422).json({msg: "Wrong date format or invalid date, date format must be MM/DD/YYYY", code: "422"});
            //Convert date to UnixTimeStamp
            var UnixDateStartDate = convertStartDate/10000;
        } else var UnixDateStartDate = null;
        if(req.body.infoArray.endDate !== null && req.body.infoArray.endDate !== undefined 
            && req.body.infoArray.endDate !== ""){
            //Convert date to javascript date
            var convertEndDate = new Date(req.body.infoArray.endDate);
            //Check if dates are valid
            //if not returns 422
            if(isNaN(convertEndDate)) return res.status(422).json({msg: "Wrong date format or invalid date, date format must be MM/DD/YYYY!", code: "422"});
            //Convert date to UnixTimeStamp
            var UnixDateEndDate = convertEndDate/10000;
        } else var UnixDateEndDate = null;

        if(req.body.infoArray.startDate !== null && req.body.infoArray.startDate !== undefined
            && req.body.infoArray.startDate !== "" && req.body.infoArray.endDate !== null && req.body.infoArray.endDate !== undefined 
            && req.body.infoArray.endDate !== "" ) {
            if(UnixDateStartDate >= UnixDateEndDate) return res.status(409).json({msg: "Start date must be before end date 1!", code: "409"});
        } else {
            if(req.body.infoArray.startDate !== null && req.body.infoArray.startDate !== undefined
                && req.body.infoArray.startDate !== "" && UnixDateStartDate >= electionInfo.endDate) return res.status(409).json({msg: "Start date must be before end date 2!", code: "409"});
            if(req.body.infoArray.endDate !== null && req.body.infoArray.endDate !== undefined
                && req.body.infoArray.endDate !== "" && UnixDateEndDate <= electionInfo.startDate) return res.status(409).json({msg: "Start date must be before end date 3!", code: "409"});
        }

        //Defining array with info to modify
        var infoToModify = {
            startDate: UnixDateStartDate,
            endDate: UnixDateEndDate,
            illustrationUrl: req.body.infoArray.illustrationUrl,
            numberOfCandidateToVote: req.body.infoArray.numberOfCandidateToVote,
            confirmationPassword: req.body.infoArray.confirmationPassword,
            active: req.body.infoArray.active,
        };

        electionControllers.modifyElectionInfo(req.body.electionId, infoToModify, (err, success) => {
            if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(success) return res.status(200).json({msg: "Success updating election info!", code: "200", preview: success})
        });
    }
});

routerElectionEdit.delete(rootRoute + "/edit", (req, res) => {
    //Check if input is missing
    if(!req.body.electionId) 
        return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Checks if session or token is missing
    if(!req.session.token) return res.redirect(401, mainHost + loginRoute);
    //Check if client is a candidate or administrator
    tokenControllers.checkIfIsCandidate(req.session.token, (err, isCandidate) => {
        //Return 500 in case of internal server error
        if(err) return res.status(500).json({msg: "Internal sever error!", code: "500"});
        //If is a candidate returns 403 ad only admin have access to this
        if(isCandidate) return res.status(403).json({msg: "You must be an administrator to do this action!", code: "403"});
        //If not proceed
        if(!isCandidate) tokenControllers.checkAdminToken(req.session.token, true, (err, tokenPayload) => {
            if(err) { 
                //Return 500 in case of internal server error
                //or redirects to logout page in case of invalid token
                if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                if(err === 2) return res.redirect(401, mainHost + logoutRoute);
            }
            //Check if election exists
            if(tokenPayload) electionControllers.checkIfElectionExists({_id: req.body.electionId}, (err, result1) => {
                if(err) {
                    //Return 500 in case of internal server error
                    //or 404 for an not found election
                    if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                    if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
                }
                if(result1){
                    //Defining needed scopes to proceed
                    var authorizedScopes = ["role:master", "election:admin"];
                    //Checks if has master or admin access 
                    if(tokenPayload && !authControllers.checkScopes(tokenPayload.scopes, authorizedScopes)) 
                        //If hasn't check if is election owner and still
                        //has add, edit and delete elections access
                        //but before gets lection info to check author id 
                        electionControllers.getElectionInfo(req.body.electionId, (err, result2) => {
                            if(err) {
                                //Return 500 in case of internal server error
                                //or 404 for an not found election
                                if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                                if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
                            }
                            //Checks if is the author and if user still is
                            //allowed to add, edit and delete
                            if(result2.authorID === tokenPayload.userId && authControllers.checkScopes(tokenPayload.scopes, "election:add_a_edit_a_delete")) 
                                proceed();
                            else return res.status(403).json({msg: "You are not authorized to edit this election!", code: "403"});
                    });
                    //If has proceed
                    else proceed();
                }
            });
        });
    });
    //Function that actually deletes election
    function proceed() {
        //Calls controller to delete election
        electionControllers.deleteElection(req.body.electionId, (err, success) => {
            //Returns 500 in case of error while deleting election
            if(err) return res.status(500).json({msg: "Internal sever error!", code: "500"});
            //Returns success in case everything occurs as expected
            if(success) return res.status(200).json({msg: "Success on deleting election!", code: "200"});
        });
    }
});

routerElectionEdit.put(rootRoute + "/vote", (req, res) => {
    
});

module.exports = routerElectionEdit;


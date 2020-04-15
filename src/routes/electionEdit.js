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
                //Set variables in array to create election
                var infoToCreateArray = {
                    name: req.body.infoArray.name,
                    authorName: result.name,
                    authorID: tokenPayload.userId,
                    startDate: req.body.infoArray.startDate,
                    endDate: req.body.infoArray.endDate,
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
                                proceed();
                            else return res.status(403).json({msg: "You are not authorized to edit this election!", code: "403"});
                    });
                    //If has proceed
                    else proceed();
                }
            });
        });
    });
    //Function that actually creates election
    function proceed() {
        //Defining array with info to modify
        var infoToModify = {
            startDate: req.body.infoArray.startDate,
            endDate: req.body.infoArray.endDate,
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
    
});

routerElectionEdit.put(rootRoute + "/vote", (req, res) => {
    
});

module.exports = routerElectionEdit;


const routerElection_a_Candidates = require("express").Router();

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
const election_a_candidatesControllers = require("../controllers/candidates");

//Allow to participate or not candidate
routerElection_a_Candidates.put(rootRoute + "/participate/allow", (req, res) => {
    //Check if input is missing
    if(!req.body.electionId || !req.body.candidateId ||
       req.body.valueToSet === null || req.body.valueToSet === undefined ||
       req.body.valueToSet === "") 
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
    //Function that actually allows or un-allow election
    function proceed() {
        //Call controller to allow or un-allow
        election_a_candidatesControllers.allowOrNParticipation(req.body.electionId, req.body.candidateId, req.body.valueToSet, (err, success, valueSet) => {
            if(err) {
                //Return 500 in case of internal server error
                //or 404 for an not found request
                if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
            }
            //In case of success return 200 and value that has been modified to
            if(success && valueSet === false) return res.status(200).json({msg: "Success not allowing user to participate!", code: "200"});
            if(success && valueSet === true) return res.status(200).json({msg: "Success allowing user to participate!", code: "200"});
        });
    }
});

//Request to participate to election (for candidates only)
routerElection_a_Candidates.post(rootRoute + "/participate/request", (req, res) => {
    //Checks for empty or missing input
    if(!req.body.electionId) return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Check if there is a session 
    if(!req.session.token) return res.redirect(401, mainHost + loginRoute);
    //Check if client is a candidate or administrator
    tokenControllers.checkIfIsCandidate(req.session.token, (err, isCandidate) => {
        //Return 500 in case of internal server error
        if(err) return res.status(500).json({msg: "Internal sever error!", code: "500"});
        //If is not a candidate returns 403, as this can only be done by candidates
        if(!isCandidate) return res.status(403).json({msg: "You must be a candidate to do this action!", code: "403"});
        //If is then check token validity
        if(isCandidate) tokenControllers.checkCandidateToken(req.session.token, true, (err, tokenPayload) => {
            if(err) {
                //Return 500 in case of internal server error
                //or redirects to logout page in case of invalid token
                if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                if(err === 2) return res.redirect(401, mainHost + logoutRoute);
            }
            if(tokenPayload) election_a_candidatesControllers.checkIfThereIsRequest(req.body.electionId, tokenPayload.userId, (err, hasRequest) => {
                //Return 500 in case of error
                if(err) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                //In case request already exists
                if(hasRequest === 2) return res.status(200).json({msg: "Your request has already ben made, wait for an administrator to allow access!", code: "200"});
                if(hasRequest === 1) electionControllers.checkElectionStatus(req.body.electionId, (err, status) => {
                    if(err) {
                        //Return 500 in case of internal server error
                        //or 404 for an not found election
                        if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                        if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
                    }
                    //In case has ended or is ongoing return 403
                    if(status !== 1) return res.status(403).json({msg: "Election ended or already started, you can not request to participate anymore!", code: "403"});
                    //Else proceed
                    else proceed(tokenPayload);
                });
            });
        });
    });

    //Proceed requesting
    function proceed(tokenPayload){
        election_a_candidatesControllers.createRequest(req.body.electionId, tokenPayload.userId, (err, success) => {
            if(err) {
                //Return 500 in case of internal server error
                //or 404 for an not found election
                if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
            }
            if(success) return res.status(200).json({msg: "Success while requesting to participate!", code: "200"});
        });
    }
});

//Request to participate to election (for candidates only)
routerElection_a_Candidates.delete(rootRoute + "/participate/request", (req, res) => {
    //Checks for empty or missing input
    if(!req.body.electionId) return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Check if there is a session 
    if(!req.session.token) return res.redirect(401, mainHost + loginRoute);
    //Check if client is a candidate or administrator
    tokenControllers.checkIfIsCandidate(req.session.token, (err, isCandidate) => {
        //Return 500 in case of internal server error
        if(err) return res.status(500).json({msg: "Internal sever error!", code: "500"});
        //If is not a candidate returns 403, as this can only be done by candidates
        if(!isCandidate) return res.status(403).json({msg: "You must be a candidate to do this action!", code: "403"});
        //If is then check token validity
        if(isCandidate) tokenControllers.checkCandidateToken(req.session.token, true, (err, tokenPayload) => {
            if(err) {
                //Return 500 in case of internal server error
                //or redirects to logout page in case of invalid token
                if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                if(err === 2) return res.redirect(401, mainHost + logoutRoute);
            }
            if(tokenPayload) election_a_candidatesControllers.checkIfThereIsRequest(req.body.electionId, tokenPayload.userId, (err, hasRequest) => {
                //In case of error
                if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
                //If request does not exists 
                if(hasRequest === 1) return res.status(404).json({msg: "Request not found for this candidate or election!", code: "404"});
                //In case request does not exists 
                if(hasRequest === 2) election_a_candidatesControllers.getRequestInfo(req.body.electionId, tokenPayload.userId, (err, result) => {
                    if(err) {
                        //Return 500 incas of internal server error
                        //or 404 in case request is not found
                        if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                        if(err === 2) return res.status(404).json({msg: "Request not found!", code: "404"});
                    }
                    if(result && result.candidateId === tokenPayload.userId) return proceed(tokenPayload);
                    if(result && result.candidateId !== tokenPayload.userId) return res.status(403).json({msg: "You are not the owner of this request!", code: "403"});
                });
            });
        });
    });

    //Proceed requesting
    function proceed(tokenPayload){
        election_a_candidatesControllers.deleteRequest(req.body.electionId, tokenPayload.userId, (err, success) => {
            //In case of error return 500
            if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
            //In case of success
            if(success) return res.status(200).json({msg: "Your request to this election has been removed!", code: "200"});
        });
    }
});

//Get elections participating
routerElection_a_Candidates.get(rootRoute + "/participate/isParticipating", (req, res) => {

});


module.exports = routerElection_a_Candidates;
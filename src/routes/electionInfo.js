const routeElectionInfo = require("express").Router();

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


//Get detailed elections list (for admins only)
routeElectionInfo.get(rootRoute + "/get/extended", (req, res) => {
    //Check if there is a token
    if(!req.session.token) return res.redirect(401, mainHost + "/login");
    //Check if users is an admin or candidate
    tokenControllers.checkIfIsCandidate(req.session.token, (err, isCandidate) => {
        //Return 500 error in case of internal server error
        if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
        //Check if is a candidate
        if(isCandidate) return res.status(403).json({msg: "You must be an admin to do this!", code: "403"});
        //In case is not a candidate, checks token validity
        if(!isCandidate) tokenControllers.checkAdminToken(req.session.token, true, (err, tokenPayload) => {
            if(err) {
                //Returns 500 error in case of internal server error
                //or in case of invalid token redirects to logout route
                if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                if(err === 2) return res.redirect(403, mainHost + "/logout");
            }
            //Defining authorized scopes 
            var checkOwnElectionsScopes = ["election:add_a_edit_a_delete"];
            var authorizedScopes = ["role:master", "election:admin"];
            //Check if user has the necessary scopes
            if(tokenPayload) authControllers.checkScopes(tokenPayload.scopes, authorizedScopes, (hasScopes) => {
                //If hasn't higher admin scopes, check if can get own elections
                //in case has a lower election scope
                if(!hasScopes) authControllers.checkScopes(tokenPayload.scopes, checkOwnElectionsScopes, (hasScopes) => {
                    //If hasn't any of the scopes return 403
                    if(!hasScopes) return res.status(403).json({msg: "You haven't got any access to elections edition or administration!", code: "403"});
                    //In case has, get elections from this user
                    if(hasScopes) electionControllers.getElectionsExtended(tokenPayload.userId, (err, elections) => {
                        if(err) {
                            //Returns 500 in case of internal server error
                            //or empty result in case user has any elections
                            if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                            if(err === 2) return res.status(200).json({msg: "You haven't got any elections yet!", code: "200", result: {}});
                        }
                        //In case of success
                        if(elections) return res.status(200).json({msg: "Success gathering your elections!", code: "200", result: elections});
                    });
                });
                //In case has all scopes get all elections
                else electionControllers.getElectionsExtended(false, (err, elections) => {
                    if(err) {
                        //Returns 500 in case of internal server error
                        //or empty result in case user has any elections
                        if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                        if(err === 2) return res.status(200).json({msg: "There is any election created yet!", code: "200", result: {}});
                    }
                    //In case of success
                    if(elections) return res.status(200).json({msg: "Success gathering all elections!", code: "200", result: elections});
                });
            });
        });
    });
});

//Get detailed info (for admins only)
routeElectionInfo.get(rootRoute + "/info/extended/:electionId", (req, res) => {
    //Check if input is empty
    if(!req.params.electionId) return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Check if there is a token
    if(!req.session.token) return res.redirect(401, mainHost + "/login");
    //Check if users is an admin or candidate
    tokenControllers.checkIfIsCandidate(req.session.token, (err, isCandidate) => {
        //Return 500 error in case of internal server error
        if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
        //Check if is a candidate
        if(isCandidate) return res.status(403).json({msg: "You must be an admin to do this!", code: "403"});
        //In case is not a candidate, checks token validity
        if(!isCandidate) tokenControllers.checkAdminToken(req.session.token, true, (err, tokenPayload) => {
            if(err) {
                //Returns 500 error in case of internal server error
                //or in case of invalid token redirects to logout route
                if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                if(err === 2) return res.redirect(403, mainHost + "/logout");
            }
            //Defining authorized scopes 
            var checkOwnElectionsScopes = ["election:add_a_edit_a_delete"];
            var authorizedScopes = ["role:master", "election:admin"];
            //Check if user has the necessary scopes
            if(tokenPayload) authControllers.checkScopes(tokenPayload.scopes, authorizedScopes, (hasScopes) => {
                //If hasn't higher admin scopes, check if can get own elections
                //in case has a lower election scope
                if(!hasScopes) authControllers.checkScopes(tokenPayload.scopes, checkOwnElectionsScopes, (hasScopes) => {
                    //If hasn't any of the scopes return 403
                    if(!hasScopes) return res.status(403).json({msg: "You haven't got any access to elections edition or administration!", code: "403"});
                    //In case has, get elections from this user
                    if(hasScopes) electionControllers.checkIfIsElectionCreator(tokenPayload.userId, req.params.electionId, (err, isAuthor) => {
                        if(err) {
                            //Returns 500 in case of internal server error
                            //or 404 in case of not found
                            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                            if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
                        }
                        if(!isAuthor) res.status(403).json({msg: "You are not authorized to see this election extended info!", code: "403"});
                        if(isAuthor) return proceed();
                    });
                });
                //In case has all scopes get all elections
                else return proceed();

                //Function that proceeds in extended info gathering
                function proceed() {
                    //Controller to get extended info
                    electionControllers.getElectionInfoExtended(tokenPayload.userId, req.params.electionId, (err, success) => {
                        if(err) {
                            //Returns 500 in case of internal server error
                            //or 404 in case of not found
                            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                            if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
                        }
                        if(success) return res.status(200).json({msg: "Success on gathering election information!", code: "200", result: success});
                    });
                }
            });
        });
    });
});

//Get non detailed elections list (for normal users)
routeElectionInfo.get(rootRoute + "/get", (req, res) => electionControllers.getElections((err, success) => {
    if(err) {
        //Return 500 in case of internal server error
        //or 200 and empty results
        if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
        if(err === 2) return res.status(200).json({msg: "No elections found!", code: "200", results: success});
    }
    if(success) return res.status(200).json({msg: "Success retrieving elections!", code: "200", results: success})
}));

//Get non detailed info (for normal users)
routeElectionInfo.get(rootRoute + "/info/:electionId",(req, res) => {
    //Check for input
    if(!req.params.electionId) return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Controller to get election info
    electionControllers.getElectionInfo(req.params.electionId, (err, result) => {
        if(err) {
            //Return 500 in case of internal server error
            //or 404 for election not found
            if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
            if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
        }
        if(result && !result.active) return res.status(403).json({msg: "Election can't be accessed!", code: "403"});
        if(result) electionControllers.checkElectionStatus(req.params.electionId, (err, dateStatus, status) => {
            if(err) {
                //Return 500 in case of internal server error
                //or 404 for election not found
                if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
                if(err === 2) return res.status(404).json({msg: "Election not found!", code: "404"});
            }
            if(dateStatus === 2 && status) return res.status(200).json({msg: "Success retrieving election info!", code: "200", results: result});
            else res.status(403).json({msg: "Your not allowed to get this election info!", code: "403"});
        });
    });
});

//Get results
routeElectionInfo.get(rootRoute + "/results/:electionId",(req, res) => {
    //Check for input
    if(!req.params.electionId) return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Controller that gets election results
    electionControllers.electionResults(req.params.electionId, (err, success) => {
        if(err) {
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.status(404).json({msg: "Election not found sorry", code: "404"});
            if(err === 3) return res.status(403).json({msg: "You can't see this election result yet", code: "403"});
            if(err === 4) return res.status(404).json({msg: "No candidates in this election!", code: "404"});
        }
        if(success) return res.status(200).json({msg: "Success retrieving this election results!", code: "200", results: success});
    });
});

module.exports = routeElectionInfo;

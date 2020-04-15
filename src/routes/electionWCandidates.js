const routerElectionWCandidates = require("express").Router();

const {
    mainHost,
    rootRoute,
    loginRoute,
    adminPanelRoute,
    logoutRoute
} = require("../urls");

//Allow to participate or not candidate
routerElectionWCandidates.put(mainHost + rootRoute + "/candidate/allow", (req, res) => {

});
//Block or unblock candidate access, 
//request and participation to election
routerElectionWCandidates.put(mainHost + rootRoute + "/candidate/block", (req, res) => {
    
});

module.exports = routerElectionWCandidates;
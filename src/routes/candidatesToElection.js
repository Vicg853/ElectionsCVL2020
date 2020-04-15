const routeElectionInfo = require("express").Router();

const {
    mainHost,
    rootRoute,
    loginRoute,
    adminPanelRoute,
    logoutRoute
} = require("../urls");

//Request to participate to election (for candidates only)
routeElectionInfo.post(mainHost + rootRoute + "/participate/request", (req, res) => {

});

//Request to participate to election (for candidates only)
routeElectionInfo.delete(mainHost + rootRoute + "/participate/request", (req, res) => {

});

//Get elections participating
routeElectionInfo.get(mainHost + rootRoute + "/participate/isParticipating", (req, res) => {

});

module.exports = routeElectionInfo;

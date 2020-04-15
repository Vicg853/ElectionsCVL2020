const routeElectionInfo = require("express").Router();

const {
    mainHost,
    rootRoute,
    loginRoute,
    adminPanelRoute,
    logoutRoute
} = require("../urls");

//Get detailed elections list (for admins only)
routeElectionInfo.get(mainHost + rootRoute + "/get/extended", (req, res) => {

});

//Get detailed info (for admins only)
routeElectionInfo.get(mainHost + rootRoute + "/info/extended", (req, res) => {

});

//Get non detailed elections list (for normal users)
routeElectionInfo.get(mainHost + rootRoute + "/get", (req, res) => {

});

//Get non detailed info (for normal users)
routeElectionInfo.get(mainHost + rootRoute + "/info",(req, res) => {

});

//Get results
routeElectionInfo.get(mainHost + rootRoute + "/results",(req, res) => {

});

//Get elections candidates can participate
routeElectionInfo.get(mainHost + rootRoute + "/participate/getElections", (req, res) => {

});


module.exports = routeElectionInfo;

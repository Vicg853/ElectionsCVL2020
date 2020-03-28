const router = require('express').Router();
const rootRoute = "/api"

const schoolCardController = require('./controllers/schoolCardController');
const electionController = require('./controllers/electionControllers');
const candidatesController = require('./controllers/candidatesControllers');
const adminAuthController = require('./controllers/adminAuthController');

router.post(rootRoute + '/vote', (req, res) => {
    if(!req.body.schoolCardId || !req.body.password
        || !req.body.candidatesArray || !req.body.electionID
    ) return res.status(422).json({msg: "Missing input!", code: "422"});
    schoolCardController.schoolCardVerify(req.body.schoolCardId, req.body.password, (err, success) => {
        if(err) {
            if(err == 1) return res.status(500).json({msg: "Already voted!", code: "403"});
            if(err == 2) return res.status(500).json({msg: "Invalid user credentials!", code: "401"});
            if(err == 3) return res.status(500).json({msg: "Internal server error!", code: "500"});
        }
        if(success) electionController.checkIfAlreadyVoted(req.body.schoolCardId, req.body.electionID, (err, result) => {
            if(err){
                if(err == 1) return res.status(403).json({msg: "You already voted!", code: "403"}); 
                if(err == 2) return res.status(500).json({msg: "Internal server error!", code: "500"});
            }
            if(result) electionController.checkDate(req.body.electionID, (err, success1) => {
                if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
                if(success1 == 1) return res.status(403).json({msg: "You can not vote yet!", code: "403"});
                if(success1 == 3) return res.status(403).json({msg: "You can not vote anymore!", code: "403"});
                if(success1 == 2) candidatesController.addVote(req.body.electionID, req.body.candidatesArray, (err, success2) => {
                    if(err){
                        if(err == 1) return res.status(404).json({msg: "Candidate not found!", code: "404"});
                        if(err == 2) return res.status(422).json({msg: "Missing or excessive candidates to vote !", code: "422"});
                        if(err == 3) return res.status(422).json({msg: "Repeated candidate id, you can only vote one time in each one !", code: "422"});
                        if(err == 4) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    }
                    if(success2) electionController.setSchoolCardVotedElection(req.body.electionID, req.body.schoolCardId, (err, success3) => {
                        if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
                        if(success3) return res.status(200).json({msg: "You just voted successfully, wait for the results now!", code: "200"});
                    }); 
                    else return res.status(500).json({msg: "Internal server error!", code: "500"});
                });
                else return res.status(500).json({msg: "Internal server error!", code: "500"});
            });
            else return res.status(500).json({msg: "Internal server error!", code: "500"});
        });
        else return res.status(500).json({msg: "Internal server error!", code: "500"});
    });
});

router.post(rootRoute + '/results', (req, res) => {
    if(!req.body.electionID) return res.status(422).json({msg: "Missing input!", code: "422"});
    electionController.checkDate(req.body.electionID, (err, success) => {
        if(err) return res.status(500).json({msg: 'Internal server error !', code: '500'});
        if(success < 3) {
            adminAuthController.checkAdminAuth(req.body.authToken, (err, success1) => {
                if(err){
                    if(err == 1) return res.status(403).json({msg: "You can not see results yet !", code: "403"});
                    if(err == 2) return res.status(500).json({msg: "Internal server error!", code: "500"});
                }
                if(success1) return success = 3;
            });
        }
        if(success == 3) candidatesController.getVotes(req.body.electionID, (err, success2) => {
            if(err){
                if(err == 1) return res.status(404).json({msg: "Sorry, election not found !", code: "404"});
                if(err == 2) return res.status(500).json({msg: "Internal server error !", code: "500"});
            }
            return res.status(200).json({msg: "Success getting result!", code: "200", results: success2});
        });
    });
});

router.post(rootRoute + '/candidates', (req, res) => {
    if(!req.body.electionID) return res.status(422).json({msg: "Missing input!", code: "422"});
    candidatesController.getCandidates(req.body.electionID, (err, success) => {
        if(err){
            if(err == 1) return res.status(404).json({msg: "Election not found!", code: "404"});
            if(err == 2) return res.status(500).json({msg: "Internal server error!", code: "500"});
        }
        return res.status(200).json({msg: "Success retrieving candidates!", code: "200", results: success});
    });
});

router.get(rootRoute + '/elections', (req, res) => {
    if(!req.body.electionID) electionController.getElections(req.body.all, req.body.token, (err, success) => {
        if(err){
            if(err === 1) return res.status(403).json({msg: "Unauthorized!", code: "403"});
            if(err === 2) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 3) return res.status(422).json({msg: "Invalid input!", code: "422"});
        }
        return res.status(200).json({msg: "Success retrieving elections!", code: "200", results: success})
    });
    else electionController.getElectionInfo(req.body.electionID, req.body.token, (err, success) => {
        if(err){
            if(err === 1) return res.status(404).json({msg: "Sorry, election could not be found!", code: "404"});
            if(err === 2) return res.status(403).json({msg: "Unauthorized!", code: "403"});
            if(err === 3) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 4) return res.status(422).json({msg: "Invalid input!", code: "422"});
        }
        else return res.status(200).json({msg: "Success while retrieving results!", code: "200", results: success});
    });
});

module.exports = router;
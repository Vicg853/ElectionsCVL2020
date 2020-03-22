const router = require('express').Router();
const rootRoute = "/main"

const schoolCardController = require('./controllers/schoolCardController');
const electionController = require('./controllers/electionControllers');
const candidatesController = require('./controllers/candidatesControllers');

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
        if(success) electionController.checkDate(req.body.electionID, (err, success1) => {
            if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(success1 == 1) return res.status(403).json({msg: "You can not vote yet!", code: "403"});
            if(success1 == 3) return res.status(403).json({msg: "You can not vote anymore!", code: "403"});
            if(success1 == 2) candidatesController.addVote(req.body.electionID, req.body.candidatesArray, (err, success2) => {
                if(err){
                    if(err == 1) return res.status(404).json({msg: "Candidate not found!", code: "404"});
                    if(err == 2) return res.status(422).json({msg: "Invalid input!", code: "422"});
                    if(err == 3) return res.status(500).json({msg: "Internal server error!", code: "500"});
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
});

module.exports = router;
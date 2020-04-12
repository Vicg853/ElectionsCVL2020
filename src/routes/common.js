const routerCommons = require("express").Router();

const tokenControllers = require("../controllers/token");

const mainHost = "http://localhost:8000"
const loginRoute = "/";

routerCommons.get("/logout", (req, res) => {
    //Check if there is actually a token and session so all doesn't happens for nothing
    if(!req.session.token) return res.status(200).redirect(mainHost + loginRoute);
    //Checks if token is valid
    tokenControllers.checkToken(req.session.token, false, (err, result) => {
        if(err){
            //Returns 500 in case of error while checking token
            if(err === 1) return res.status(500).json({msg: "Error while trying to logout, try again!", code: "500"});
            //If is not valid just cleans session and redirects to login page
            if(err === 2) req.session.destroy((err) => {
                if(err) return res.status(500).json({msg: "Error while trying to logout, try again!", code: "500"});
                return res.status(200).redirect(mainHost + loginRoute);
            });
        }
        //If is valid invalidate token by saving it into the
        //token's blacklist in db
        if(result) tokenControllers.invalidateToken(req.session.token, result, (err, success) => {
            //Returns 500 error in case of internal server error
            if(err) return res.status(500).json({msg: "Error while trying to logout, tyr again!", code: "500"});
            //In case of success destroy session and redirects to login page
            if(success) req.session.destroy((err) => {
                if(err) return res.status(500).json({msg: "Error while trying to logout, try again!", code: "500"});
                return res.status(200).redirect(mainHost + loginRoute);
            });
        });
    });
});

module.exports = routerCommons;

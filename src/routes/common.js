const routerCommons = require("express").Router();

const tokenControllers = require("../controllers/token");

const mainHost = "http://localhost:8000"
const loginRoute = "/";

routerCommons.get("/logout", (req, res) => {
    if(!req.session.token) return res.status(200).redirect(mainHost + loginRoute);
    tokenControllers.checkToken(req.session.token, false, (err, result) => {
        if(err){
            if(err === 1) return res.status(500).json({msg: "Error while trying to logout, try again!", code: "500"});
            if(err === 2) req.session.destroy((err) => {
                if(err) return res.status(500).json({msg: "Error while trying to logout, try again!", code: "500"});
                return res.status(200).redirect(mainHost + loginRoute);
            });
        }
        if(result) tokenControllers.invalidateToken(req.session.token, result, (err, success) => {
            if(err) return res.status(500).json({msg: "Error while trying to logout, tyr again!", code: "500"});
            if(!result) return res.status(500).json({msg: "Error while trying to logout, tyr again!", code: "500"});
            req.session.destroy((err) => {
                if(err) return res.status(500).json({msg: "Error while trying to logout, try again!", code: "500"});
                return res.status(200).redirect(mainHost + loginRoute);
            });
        });
    });
});

module.exports = routerCommons;

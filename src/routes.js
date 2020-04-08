const router = require("express").Router();

const {
    globalBruteforce,
    userBruteforce
} = require("./security/bruteforce");

const authControllers = require("./controllers/auth");
const tokenControllers = require("./controllers/token");
const usersControllers = require("./controllers/users");

const mainHost = "http://localhost:8000"
const rootRoute = "/api/auth";
const adminPageRoute = "/";
const loginRoute = "/";

router.post(rootRoute + "/login", 
    globalBruteforce.prevent,
    userBruteforce.getMiddleware({ 
        key: (req, res, next) => {
            next(req.body.username);
        }
    }), (req, res) => {
    if(!req.body.username || !req.body.password) return res.status(422).json({msg: "Invalid input, you must insert a username and password!", code: "422"});
    if(req.session.token) return res.status(200).redirect(mainHost + adminPageRoute);
    authControllers.checkLoginCredentials(req.body.username, req.body.password, (err, success) => {
        if(err) {
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.status(401).json({msg: "User not found or incorrect password!", code: "401"});
            if(err === 3) return res.status(401).json({msg: "User has been blocked!", code: "401"});
        }
        if(success) tokenControllers.generateToken(success, (err, success2) => {
            if(err || !success2) return res.status(500).json({msg: "Internal server error! (token)", code: "500"});
            req.brute.reset();
            req.session.token = success2;
            return res.status(200).json({msg: "Success on login procedure!", code: "200"});
        });
    });
});

router.get("/logout", (req, res) => {
    if(!req.session.token) return res.status(200).redirect(mainHost + loginRoute);
    tokenControllers.checkToken(req.session.token, (err, result) => {
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

router.post(rootRoute + "/addAdmin", 
    globalBruteforce.prevent,
    userBruteforce.getMiddleware({ 
        key: (req, res, next) => {
            next(req.session.token);
        }
    }), (req, res) => {
    if(!req.newUsername || 
       !req.newFullName || 
       !req.newEmail || 
       !req.newRole || 
       !req.newPassword || 
       !req.newPasswordConfirm || 
       !req.adminPassword) return res.status(422).json({msg: "Invalid input!", code: "422"});
    if(!req.session.token) return res.status(401).redirect(mainHost + loginRoute);
    tokenControllers.checkToken(req.session.token, (err, result) => {
        if(err) {
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.status(401).redirect(mainHost + rootRoute + "/logout");
        }
        if(!result) return res.status(500).json({msg: "Internal server error!", code: "500"});
        var authorizedRoles = ["role:IT", "role:admin"];
        authControllers.checkScopes(result.scopes, authorizedRoles, (result1) => {
            if(!result1) return res.status(403).json({msg: "You are not allowed to do this action!", code: "403"});
            if(result1) {
                var newRoleArray = [];
                var adminRoleArray = [];
                if(req.newRole === typeof Array) newRoleArray = req.newRole;
                else newRoleArray.push(req.newRole);
                if(result.scopes === typeof Array) adminRoleArray = result.scopes;
                else adminRoleArray.push(result.scopes);
                if(newRoleArray.indexOf("role:IT") >= 0 && adminRoleArray.indexOf("role:IT") < 0) return res.status(403).json({msg: "You are not allowed to do this action!", code: "403"});
                else authControllers.checkAdminPassword(result.userId, req.adminPassword, (err, result3) => {
                    if(err) {
                        if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                        if(err === 2 || err === 3) return res.status(401).redirect(mainHost + rootRoute + "/logout");
                        if(err === 4) return res.status(403).json({msg: "Wrong admin password!", code: "403"});
                    }
                    if(result3) usersControllers.createAdmin(
                    req.newUsername,
                    req.newPassword, 
                    req.newPasswordConfirm,
                    req.newFullName,
                    req.newRole,
                    req.newEmail,
                    (err, success) => {
                        if(err) {
                            if(err === 1) return res.status(422).json({msg: "The tow new passwords must be equal!", code: "422"});
                            if(err === 2) return res.status(500).json({msg: "Internal server error!", code: "500"});
                            if(err === 3) return res.status(409).json({msg: "Username or email are already in use!", code: "409"});
                        }
                        if(success) return res.status(200).json({msg: "User " + success + " created successfully", code: "200"});
                    })
                });
            }
        })
    });
});

router.put(rootRoute + "/editAdmin", (req, res) => {

});

router.delete(rootRoute + "/editAdmin", (req, res) => {

});

router.put(rootRoute + "/editPassword", (req, res) => {

});

module.exports = router;
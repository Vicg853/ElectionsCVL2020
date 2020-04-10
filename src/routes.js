const router = require("express").Router();

const {
    globalBruteforce,
    userBruteforce
} = require("./security/bruteforce");

const authControllers = require("./controllers/auth");
const tokenControllers = require("./controllers/token");
const usersControllers = require("./controllers/users");
const utilsControllers = require("./controllers/utils");

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
    if(!req.body.username || !req.body.password) return res.status(422).json({
        msg: "Invalid input, you must insert a username and password!", code: "422"});
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

router.post(rootRoute + "/addAdmin", 
    globalBruteforce.prevent,
    userBruteforce.getMiddleware({ 
        //Bruteforce check to prevent bruteforce atacks
        key: (req, res, next) => {
            next(req.session.token);
        }
    }), (req, res) => {
    if(!req.body.newUsername || 
       !req.body.newFullName || 
       !req.body.newEmail || 
       !req.body.newRole || 
       !req.body.newPassword || 
       !req.body.newPasswordConfirm || 
       !req.body.adminPassword) return res.status(422).json({msg: "Invalid input, check your inputs!", code: "422"});
    if(!req.session.token) return res.status(401).redirect(mainHost + loginRoute);
    tokenControllers.checkToken(req.session.token, true, (err, result) => {
        if(err) {
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.status(401).redirect(mainHost + "/logout");
        }
        if(!result) return res.status(500).json({msg: "Internal server error!", code: "500"});
        var authorizedRoles = ["users:add_a_edit","role:master"];
        authControllers.checkScopes(result.scopes, authorizedRoles, (result1) => {
            if(!result1) return res.status(403).json({msg: "You are not allowed to add users!", code: "403"});
            if(result1) authControllers.checkAdminPassword(result.userId, req.body.adminPassword, (err, result3) => {
                if(err) {
                    if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    if(err === 2 || err === 3) return res.status(401).redirect(mainHost + "/logout");
                    if(err === 4) return res.status(403).json({msg: "Wrong admin password!", code: "403"});
                }
                if(result3) {
                    req.brute.reset();
                    usersControllers.createAdmin(
                    req.body.newUsername,
                    req.body.newPassword, 
                    req.body.newPasswordConfirm,
                    req.body.newFullName,
                    req.body.newRole,
                    req.body.newEmail,
                    (err, success) => {
                        if(err) {
                            if(err === 1) return res.status(422).json({msg: "The tow new passwords must be equal!", code: "422"});
                            if(err === 2) return res.status(500).json({msg: "Internal server error!", code: "500"});
                            if(err === 3) return res.status(409).json({msg: "Username or email are already in use!", code: "409"});
                        }
                        if(success) return res.status(200).json({msg: "User " + success + " created successfully", code: "200"});
                    });
                }
            }); 
        });
    });
});

router.put(rootRoute + "/editAdmin", 
    globalBruteforce.prevent,
    userBruteforce.getMiddleware({ 
        //Bruteforce middleware to prevent user from bruteforcing
        //the password used to verify users authenticity to
        //modify data. 
        key: (req, res, next) => {
            next(req.session.token);
        }
    }), (req, res) => {
    //Check if all inputs are present
    if(!req.body.userId ||
       !req.body.checkPassword ||
       !req.body.infoArray) 
            return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Check if there is a token
    if(!req.session.token) return res.status(401).redirect(mainHost + loginRoute);
    //Checks token validity to verify users identity
    //and get some of its infos
    tokenControllers.checkToken(req.session.token, true, (err, tokenPayload) => {
        if(err) {
            //Return errors in case token is invalid, or internal 
            //server error
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.status(401).redirect(mainHost + "/logout");
        }
        //If token is valid proceed
        if(tokenPayload) {
            //Checks user password to check the user's authenticity
            //to the token
            authControllers.checkAdminPassword(tokenPayload.userId, req.body.checkPassword, (err, result) => {
                if(err) {
                    //Return errors for wrong password, blocked
                    //or inexistent user and internal server error
                    if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    if(err === 2 || err === 3) return res.status(401).redirect(mainHost + "/logout");
                    if(err === 4) return res.status(401).json({msg: "Wrong password!", code: "401"});
                }
                //If password is correct get user being edited info
                if(result) usersControllers.getUserInfo(req.body.userId, (err, editingUserInfo) => {
                    if(err) {
                        //Return error in case of server error
                        //or user not found
                        if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                        if(err === 2) return res.status(401).json({msg: "User not found!", code: "401"});
                    }
                    //Defining authorized scopes to edit
                    var authorizedScopes = ["users:add_a_edit", "role:master"];
                    //Check if user modifying info, is the own
                    //account owner or if it is not the accounts owner
                    if(tokenPayload.userId === req.body.userId) {
                        //Check if is trying to change scopes
                        //if yes checks if user has scope to change users
                        //because only users managers can change anyone's (even
                        //owns) scopes
                        if(req.body.infoArray.scopes 
                           && !utilsControllers.arraysMatch(req.body.infoArray.scopes, editingUserInfo.scopes)) 
                           authControllers.checkScopes(editingUserInfo.scopes, authorizedScopes, (validOrNot) => {
                            //Return error in case has not
                            if(!validOrNot) return res.status(403).json({
                                msg: "You are not allowed to do this action, you must be a higher role admin!", code: "403"});
                            else return proceed();
                        }); 
                        else proceed();
                    }
                    //Check if user has user edit scope
                    else authControllers.checkScopes(tokenPayload.scopes, authorizedScopes, (validOrNot1) => {
                        //Return error in case has not
                        if(!validOrNot1 ||
                        authControllers.checkScopes(editingUserInfo.scopes, ["role:master"])) 
                            return res.status(403).json({
                                msg: "You are not allowed to do this action, you must be a higher role admin!", code: "403"});
                        else return proceed();
                    }); 
                });

                //Proceed user info editing
                const proceed = () => {
                    if(!authControllers.checkScopes(tokenPayload.scopes, ["role:master"]) &&
                        authControllers.checkScopes(req.body.infoArray.scopes, ["role:master"])) 
                        return res.status(403).json({
                            msg: "You are not allowed to do this action, you must be a higher role admin, 2!", code: "403"});

                    //Reset bruteforce counter, as user has passed all verification
                    req.brute.reset();
                    usersControllers.changeUserInfo(req.body.userId, req.body.infoArray, (err, editedUserName) => {
                        //Check if there was an system error 
                        if(err) return res.status(500).json({msg: "Internal server error!", code: "500"}); 
                        if(editedUserName) {
                            if(tokenPayload.userId === req.body.userId) return res.status(200).redirect(rootRoute + "/logout?changedInfo=true");
                            else return res.status(200).json({msg: "Succes while modifying " + editedUserName + "'s info!", code: "200"});
                        }
                    });
                }
            });
        }
    });
});

router.delete(rootRoute + "/editAdmin",
    globalBruteforce.prevent, 
    userBruteforce.getMiddleware({ 
        //Bruteforce middleware to prevent user from bruteforcing
        //the password used to verify users authenticity to
        //modify data. 
        key: (req, res, next) => {
            next(req.session.token);
        }
    }), (req, res) => {
    //Check if input is correct else return invalid input error
    if(!req.body.userId ||
       !req.body.checkPassword) return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Check if token exist else send to login page
    if(!req.session.token) return res.status(401).redirect(mainHost + loginRoute);
    //Checks if token is valid 
    tokenControllers.checkToken(req.session.token, true, (err, tokenPayload) => {
        if(err) {
            //Returns 500 in case of server error (or other)
            //or 401 if token is not valid sending then 
            //user to logout route
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.status(401).redirect(mainHost + "/logout");
        }
        //If token is valid and there is no error
        //checks that confirmation password inserted by the user
        //is correct in the purpose of confirming users identity
        if(tokenPayload) authControllers.checkAdminPassword(tokenPayload.userId, req.body.checkPassword, (err, valid) => {
            if(err) {
                //Return 500 error in case of server error or
                //401/403 and logout route in case user hasn't 
                //been found or is blocked or it's password is
                //wrong
                if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                if(err === 2 || err === 3) return res.status(401).redirect(mainHost + "/logout");
                if(err === 4) return res.status(403).json({msg: "Verification password is incorrect!", code: "403"});
            }
            //If all goes well
            //Check if user is auto deleting itself 
            //or an other user
            if(valid) usersControllers.getUserInfo(req.body.userId, (err, success) => {
                if(err){
                    //Error in case of internal server error
                    //or in case if user hasn't been found
                    if(err === 1) return res.status(500).json({msg: "Internal server error, sorry try again!", code: "500"});
                    if(err === 2) return res.status(401).json({msg: "Sorry user not found!", code: "401"});
                }
                if(tokenPayload.userId === req.body.userId) return proceed();
                else{
                    //If it is another, check if the admin has enough
                    //role to edit users
                    //Defining needed roles to remove users
                    var authorizedScopes = ["users:add_a_edit", "role:master"];
                    //Checking if user requesting delete has necessary scopes
                    if(valid) authControllers.checkScopes(tokenPayload.scopes, authorizedScopes, (neededScopes) => {
                        //Return error in case user hasn't got it
                        if(!neededScopes) return res.status(403).json({msg: "You're not allowed to remove users!", code: "403"});     
                        //Check if is master and call proceed function in case
                        //user hasn't, else return 403 error "not allowed"
                        if(!authControllers.checkScopes(success.scopes, "role:master")) return proceed();
                        else return res.status(403).json({
                            msg: "You are not allowed to remove this user because he has master role", code: "403"});
                    });
                }
            });
            //Function called to proceed operation after verifications
            function proceed(){
                req.brute.reset();
                usersControllers.deleteUser(req.body.userId, (err, result) => {
                    if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    if(result && tokenPayload.userId === req.body.userId) return res.status(200).redirect(mainHost + "/logout?deleteUser=true")
                    if(result && tokenPayload.userId !== req.body.userId) return res.status(200).json({msg: "Success deleting user!", code: "200"});
                });
            }
        });
    });
});

router.put(rootRoute + "/editPassword",
    globalBruteforce.prevent, 
    userBruteforce.getMiddleware({ 
        //Bruteforce middleware to prevent user from bruteforcing
        //the password used to verify users authenticity to
        //modify data. 
        key: (req, res, next) => {
            next(req.session.token);
        }
    }), (req, res) => {
        //Check if input is correct
        if(!req.body.oldPassword ||
           !req.body.newPassword ||
           !req.body.newPasswordConfirm) 
            return res.status(422).json({msg: "Invalid input!", code: "422"});
        //Check if user is logged in 
        if(!req.session.token) return res.status(200).redirect(mainHost + "/login");
        //Check if two new passwords inputs are equal so the user
        //is really inputted correctly
        if(req.body.newPassword !== req.body.newPasswordConfirm) return res.status(422).json({msg: "New passwords must be equal!", code: "422"});
        //check if user token is correct and valid
        tokenControllers.checkToken(req.session.token, true, (err, tokenPayload) => {
            if(err){
                //Return 500 error in case of internal server error
                //or 401 and redirects to logout route
                //in case of invalid token
                if(err === 1) return res.status(500).json({msg: "Internal server erro!", code: "500"});
                if(err === 2) return res.status(401).redirect(mainHost + "/logout");
            }
            //If token is valid, check if verification password is
            //correct 
            if(tokenPayload) authControllers.checkAdminPassword(tokenPayload.userId, req.body.oldPassword, (err, valid) => {
                if(err) {
                    //Return 500 in case of internal server error 
                    //or 401 and redirects to logout page in case of inexistent user
                    //or 403 in case of wrong password 
                    if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    if(err === 2 || err === 3) return res.status(401).redirect(mainHost + "/logout")
                    if(err === 4) return res.status(403).json({msg: "Old password is incorrect!", code: "403"});
                }
                //In case password is correct modify users information 
                if(valid) {
                    //Reset brute as user passed through all verifications
                    req.brute.reset();
                    //Call function to modify user information
                    usersControllers.modifyUserPassword(tokenPayload.userId, req.body.newPassword, (err, success) => {
                        if(err) {
                            //Return 500 in case of internal server error
                            //or 401 in case user isn't found
                            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                            if(err === 2) return res.status(401).json({msg: "User not found!", code: "401"});
                        }
                        //If success returns 200 and redirects to logout page
                        if(success) return res.status(200).redirect(mainHost + "/logout?changedInfo=true");
                    });
                }
            });
        }); 
});

module.exports = router;
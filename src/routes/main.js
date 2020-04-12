//Defining main variables that make 
const router = require("express").Router();

const {
    globalBruteforce,
    userBruteforce
} = require("../security/bruteforce");

const authControllers = require("../controllers/auth");
const tokenControllers = require("../controllers/token");
const usersControllers = require("../controllers/users");
const utilsControllers = require("../controllers/utils");

const mainHost = "http://localhost:8000"
const rootRoute = "/api/auth/admin";
const adminPageRoute = "/";
const loginRoute = "/";


router.post(rootRoute + "/login", 
    globalBruteforce.prevent,
    userBruteforce.getMiddleware({ 
        key: (req, res, next) => {
            next(req.body.username);
        }
    }), (req, res) => {
    //Check if there is username and password input
    if(!req.body.username || !req.body.password) return res.status(422).json({
        msg: "Invalid input, you must insert a username and password!", code: "422"});
    //Check if there is already a token or session to prevent
    //two logins in one browser
    if(req.session.token) return res.status(200).redirect(mainHost + adminPageRoute);
    //Check login credentials (username and password)
    authControllers.checkLoginCredentials(req.body.username, req.body.password, (err, success) => {
        if(err) {
            //Returns 500 error in case of internal server error
            //or 401 if user is not found or password is wrong
            //or if user has been blocked
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.status(401).json({msg: "User not found or incorrect password!", code: "401"});
            if(err === 3) return res.status(401).json({msg: "User has been blocked!", code: "401"});
        }
        //In case of success generates token
        if(success) tokenControllers.generateToken(success, (err, success2) => {
            //Reset brute as all credentials are correct
            req.brute.reset();
            //Returns 500 in case of internal server error 
            if(err || !success2) return res.status(500).json({msg: "Internal server error! (token)", code: "500"});
            //Saves token in session cookie
            req.session.token = success2;
            //Returns 200 status and success message and session cookies
            return res.status(200).json({msg: "Success on login procedure!", code: "200"});
        });
    });
});

router.post(rootRoute + "/add", 
    globalBruteforce.prevent,
    userBruteforce.getMiddleware({ 
        //Bruteforce check to prevent bruteforce atacks
        key: (req, res, next) => {
            next(req.session.token);
        }
    }), (req, res) => {
    //Check if input is correct 
    //or return 422 for invalid input
    if(!req.body.newUserUsername || 
       !req.body.newUserFullName || 
       !req.body.newUserEmail || 
       !req.body.newUserScopes || 
       !req.body.newUserPassword || 
       !req.body.newUserPasswordConfirm || 
       !req.body.checkPassword) return res.status(422).json({msg: "Invalid input, check your inputs!", code: "422"});
    //Check if user is logged in
    if(!req.session.token) return res.status(401).redirect(mainHost + loginRoute);
    //Gets token payload to check scopes
    tokenControllers.checkToken(req.session.token, false, (err, preTokenCheck) => {
        if(err) {
            //Returns 500 in case of internal server error
            //or redirects to logout with 401 if token is invalid
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.redirect(401, mainHost + "/logout");
        }
        //Check if user is a candidate
        if(preTokenCheck) authControllers.checkScopes(preTokenCheck, ["role:candidate"], (isCandidate) => {
            //In case user is a candidate returns 403 error
            if(isCandidate) return res.status(403).json({msg: "You must be an admin to create admins!", code: "403"});
            //Now really checks if user token is really correct
            if(!isCandidate) tokenControllers.checkToken(req.session.token, true, (err, tokenPayload) => {
                if(err) {
                    //Returns 500 in case of internal server error
                    //or redirects to logout with 401 if token is invalid
                    if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    if(err === 2) return res.redirect(401, mainHost + "/logout");
                }
                //Defining variables authorized to add users
                var authorizedScopes = ["role:master", "users:add_a_edit"];
                //Check if admin has scopes to add users
                if(tokenPayload) authControllers.checkScopes(tokenPayload.scopes, authorizedScopes, (hasNecessaryScopes) => {
                    //Return 403 if user has not got necessary scopes
                    if(!hasNecessaryScopes) return res.status(403).json({msg: "You don't have necessary scope to add users!", code: "403"});
                    //If has proceed checking admin password
                    if(hasNecessaryScopes) authControllers.checkAdminPassword(tokenPayload.userId, req.body.checkPassword, (err, passwordCorrect) => {
                        if(err) {
                            //Return errors for wrong password, blocked
                            //or inexistent user and internal server error
                            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                            if(err === 2 || err === 3) return res.status(401).redirect(mainHost + "/logout");
                            if(err === 4) return res.status(401).json({msg: "Wrong password!", code: "401"});
                        }
                        //If password is correct check if role being added is master and if admin adding has master
                        if(passwordCorrect) {
                            //In case password is correct check if admin
                            //is trying to add a user with master role, and that this
                            //admin has master role (as you can only define a master role
                            //user being a master admin)
                            if(authControllers.checkScopes(req.body.newUserScopes, ["role:master"])) authControllers.checkScopes(tokenPayload.scopes, ["role:master"], (hasMasterRole) => {
                                //Return 403 in case user hasn't got master role
                                if(!hasMasterRole) return res.status(403).json({msg: "You're not authorized to add a master role user not having master role access!", code: "403"});
                                //Proceed in case he has
                                if(hasMasterRole) proceed();
                            });
                            //Else just proceed
                            else proceed();

                            function proceed(){
                                //Reset breuteforce as all has been verified
                                req.brute.reset();
                                //Defining info array to create admin
                                var infoArray = {
                                    username: req.body.newUserUsername,
                                    fullName: req.body.newUserFullName,
                                    password: req.body.newUserPassword,
                                    newUserPasswordConfirm: req.body.newUserPasswordConfirm,
                                    mailAddress: req.body.newUserEmail,
                                    scopes: req.body.newUserScopes,
                                }
                                //Call function to encrypt password and save user to db
                                usersControllers.createAdmin(infoArray, (err, success) => {
                                    if(err) {
                                        //Returns 422 in case passwords are not equal
                                        //or 500 in case of internal server error
                                        //or 409 in case user already exists
                                        if(err === 1) return res.status(422).json({msg: "Password and confirm password input must be equal equal!", code: "422"});
                                        if(err === 2) return res.status(500).json({msg: "Internal server error!", code: "500"});
                                        if(err === 3) return res.status(409).json({msg: "Username is already in use!", code: "409"});
                                    }
                                    //Returns 200 and success message with new user full name
                                    if(success) return res.status(200).json({msg: "User " + success + " created successfully!", code: "200"});
                                });
                            }   
                        }
    
                    });
                });
                
            });
        });
    });
});

router.put(rootRoute + "/edit", 
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
                            msg: "You are not allowed to do this action, you must be a higher role admin!", code: "403"});

                    //Reset bruteforce counter, as user has passed all verification
                    req.brute.reset();
                    usersControllers.changeUserInfo(req.body.userId, req.body.infoArray, (err, editedUserName) => {
                        //Check if there was an system error 
                        if(err) return res.status(500).json({msg: "Internal server error!", code: "500"}); 
                        if(editedUserName) {
                            if(tokenPayload.userId === req.body.userId) return res.status(200).redirect(rootRoute + "/logout?changedInfo=true");
                            else return res.status(200).json({msg: "Success while modifying " + editedUserName + "'s info!", code: "200"});
                        }
                    });
                }
            });
        }
    });
});

router.delete(rootRoute + "/delete",
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
                    if(result && tokenPayload.userId !== req.body.userId) return res.status(200).json({msg: "Success while deleting " + result + "!", code: "200"});
                });
            }
        });
    });
});

router.put(rootRoute + "/edit/password",
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

router.post(rootRoute + "/block",
    globalBruteforce.prevent, 
    userBruteforce.getMiddleware({ 
        //Bruteforce middleware to prevent user from bruteforcing
        //the password used to verify users authenticity to
        //modify data. 
        key: (req, res, next) => {
            next(req.session.token);
        }
    }), (req, res) => {
    //Check if user input is correct else return 422
    if(!req.body.userId ||
       !req.body.passwordCheck ||
       req.body.blockedValue === null) return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Check if token exists else redirect to login page
    if(!req.session.token) return res.redirect(401, mainHost + "/login");
    //Check if token is low valid and get scopes
    tokenControllers.checkToken(req.session.token, false, (err, preCheckToken) => {
        if(err) {
            //Return 500 in case of internal server error
            //or redirects to logout page with 401 in case of
            //invalid token
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.redirect(401, mainHost + "/logout");
        }
        //Checks if user is an admin
        if(preCheckToken) authControllers.checkScopes(preCheckToken.scopes, ["role:candidate"], (hasScope) => {
            //Returns 403  in case is not
            if(hasScope) return res.status(403).json({msg: "You must have administrator access to block users!", code: "403"});
            else tokenControllers.checkToken(req.session.token, true, (err, tokenPayload) => {
                if(err) {
                    //Return 500 in case of internal server error
                    //or redirects to logout page with 401 in case of
                    //invalid token
                    if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    if(err === 2) return res.redirect(401, mainHost + "/logout");
                }
                //Define array with allowed scopes to validate
                var authorizedScopes = ["role:master", "candidates:block"];
                //Checks if user has necessary admin scopes to block 
                //users
                if(tokenPayload) authControllers.checkScopes(tokenPayload.scopes, authorizedScopes, (hasAdminScopes) => {
                    if(!hasAdminScopes) return res.status(403).json({msg: "You must have higher role to block users!", code: "403"});
                    if(hasAdminScopes) authControllers.checkAdminPassword(tokenPayload.userId, req.body.passwordCheck, (err, validPassword) => {
                        if(err) {
                            //Return 500 in case of internal server error 
                            //or 401 and redirects to logout page in case of inexistent user
                            //or 403 in case of wrong password 
                            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                            if(err === 2 || err === 3) return res.status(401).redirect(mainHost + "/logout")
                            if(err === 4) return res.status(403).json({msg: "Verification password is incorrect!", code: "403"});
                        }
                        if(validPassword) usersControllers.getUserInfo(req.body.userId, (err, userInfo) => {
                            if(err) {
                                if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                                if(err === 2) return res.status(404).json({msg: "User can't be found!", code: "404"});
                            }
                            //Checks if user being modified is has master role
                            if(userInfo) authControllers.checkScopes(userInfo.scopes, ["role:master"], (isMaster) => {
                                if(isMaster) return res.status(403).json({mag: "It is not possible to modify block status of master admins!", code: "403"});
                                if(!isMaster) {
                                    //Reset brute as user passed through all verifications
                                    req.brute.reset();
                                    //Finally block or unblock user depending on value set in request
                                    usersControllers.blockOrUnblockUser(req.body.userId, req.body.blockedValue, (err, success, modifiedValue) => {
                                        if(err) {
                                            //Returns 500 in case of internal sever error
                                            //or 404 in case user is not found
                                            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                                            if(err === 2) return res.status(404).json({msg: "Admin not found!", code: "404"});
                                        }
                                        //Returns value modified and 200 in case of success
                                        if(success) return res.status(200).json({msg: "User has been " + modifiedValue + "!", code: "200"});
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
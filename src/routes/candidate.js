const candidatesRouter = require("express").Router();

const {
    globalBruteforce,
    userBruteforce
} = require("../security/bruteforce");

const authControllers = require("../controllers/candidates/auth");
const tokenControllers = require("../controllers/token");
const usersControllers = require("../controllers/candidates/candidates");
const utilsControllers = require("../controllers/utils");
const commonAuthControllers = require("../controllers/auth");

const mainHost = "http://localhost:8000"
const rootRoute = "/api/auth/candidate";
const adminPageRoute = "/";
const loginRoute = "/";

candidatesRouter.post(rootRoute + "/login", 
    globalBruteforce.prevent,
    userBruteforce.getMiddleware({ 
        //Checks bruteforce to prevent bruteforcing attacks
        key: (req, res, next) => {
            next(req.body.username);
        }
    }), (req, res) => {
    //Check input so it isn't empty
    if(!req.body.username || !req.body.password) return res.status(422).json({
        msg: "Invalid input, you must insert a username and password!", code: "422"});
    //Send user to admin panel if he is logged in already 
    if(req.session.token) return res.status(200).redirect(mainHost + adminPageRoute);
    //Checks login credentials (username and password)
    authControllers.checkLoginCredentials(req.body.username, req.body.password, (err, success) => {
        if(err) {
            //Returns 500 in case of internal server error
            //or 401 in case of user not found
            //or if user is blocked
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.status(401).json({msg: "User not found or incorrect password!", code: "401"});
            if(err === 3) return res.status(401).json({msg: "You must wait for an administrator to activate your account!", code: "401"});
        }
        //In case credentials are correct reset bruteforce 
        if(success) req.brute.reset();
        //In case credentials are correct generate token with info 
        if(success) tokenControllers.generateToken(success, (err, success2) => {
            //Return 500 in case of error while generating token
            if(err || !success2) return res.status(500).json({msg: "Internal server error! (token)", code: "500"});
            //Set session with token
            req.session.token = success2;
            //Return 200 
            return res.status(200).json({msg: "Success on login procedure!", code: "200"});
        });
    });
});

candidatesRouter.post(rootRoute + "/add", (req, res) => {
    //Check if there is empty input
    if(!req.body.NewUserUsername || !req.body.NewUserPassword ||
       !req.body.NewUserPasswordConfirm || !req.body.NewUserFullName ||
       !req.body.NewUserMailAddress || !req.body.NewUserAge ||
       !req.body.NewUserMessage || !req.body.NewUserImgUrl ||
       !req.body.NewUserClassNumber) 
        return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Check if is already logged in ass it you can't be logged in
    if(req.session.token) return res.status(200).redirect(mainHost + adminPageRoute);
    //Check if password and password confirmation are equal
    if(req.body.NewUserPassword !== req.body.NewUserPasswordConfirm)
        return res.status(422).json({msg: "Two passwords must be equals", doe: "422"});
    //Make array with info to save in mongo db
    var infoArray = {
        username: req.body.NewUserUsername,
        password: req.body.NewUserPassword,
        fullName: req.body.NewUserFullName,
        scopes: ["role:candidate"],
        blocked: true,
        mailAddress: req.body.NewUserMailAddress,
        age: req.body.NewUserAge,
        message: req.body.NewUserMessage,
        imgUrl: req.body.NewUserImgUrl,
        classNumber: req.body.NewUserClassNumber
    };
    //Call function to create user with info
    usersControllers.createCandidate(infoArray, (err, success) => {
        if(err) {
            //Return 500 in case of server error
            //or 422 in case password input is missing
            //or 409 in case username already exists
            if(err === 1) return res.status(500).json({msg: "Internal sever error!", code: "500"});
            if(err === 2) return res.status(422).json({msg: "Missing input!", code: "422"});
            if(err === 3) return res.status(409).json({msg: "Username already exist!", code: "409"});
        }
        //In case of success return 200 and redirects to login page 
        if(success) return res.status(200).redirect(mainHost + "/login?candidate=true&admin=false");
    });
});

candidatesRouter.put(rootRoute + "/edit", 
    globalBruteforce.prevent,
    userBruteforce.getMiddleware({ 
        //Bruteforce middleware to prevent user from bruteforcing
        //the password used to verify users authenticity to
        //modify data. 
        key: (req, res, next) => {
            next(req.session.token);
        }
    }), (req, res) => {
    //Check if there is empty input
    if(!req.body.userId ||
       !req.body.FullName || !req.body.MailAddress ||
       !req.body.Age || !req.body.Message ||
       !req.body.ImgUrl || !req.body.ClassNumber ||
       !req.body.confirmPassword) 
        return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Check if user is logged in else redirects to login page
    if(!req.session.token) return res.status(401).redirect(mainHost + "/login");
    //Make array with info to save in mongo db
    var infoArray = {
        fullName: req.body.FullName,
        mailAddress: req.body.MailAddress,
        age: req.body.Age,
        message: req.body.Message,
        imgUrl: req.body.ImgUrl,
        classNumber: req.body.ClassNumber
    };
    //Check if token is valid
    tokenControllers.checkToken(req.session.token, false, (err, tokenFirstCheckPayload) => {
        if(err) {
            //Returns 500 in case of internal server error
            //or 401 and redirect in case token is not valid
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.status(401).redirect(mainHost + "/logout");
        }
        //Proceed if token is valid
        if(tokenFirstCheckPayload) {
            //Checks if user is changing own account
            if(req.body.userId === tokenFirstCheckPayload.userId) tokenControllers.checkCandidateToken(req.session.token, true, (err, tokenPayload) => {
                if(err) {
                    //Returns 500 in case of internal server error
                    //or 401 and redirect in case token is not valid
                    if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    if(err === 2) return res.status(401).redirect(mainHost + "/logout");
                }
                if(tokenPayload) authControllers.checkCandidatePassword(tokenPayload.userId, req.body.confirmPassword, (err, valid) => {
                    if(err) {
                        //Returns 500 in case of internal server error
                        //or 401 and redirects to logout route in case of user not found
                        //or blocked or returns 403 in case password is wrong
                        if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                        if(err === 2 || err === 3) return res.status(401).redirect(mainHost + "/logout");
                        if(err === 4) return res.status(403).json({msg: "Wrong confirmation password!", code: "403"});
                    }
                    if(valid) return proceed();
                });
            });
            //In case it isn't the own user check if user that is cha changing is admin
            //or another candidate (because candidates can't modify anyone rather their
            //own account)
            else commonAuthControllers.checkScopes(tokenFirstCheckPayload.scopes, ["role:candidate"], (scopes) => {
                //Returns unauthorized in case user is a candidate
                if(scopes) return res.status(403).json({msg: "You haven't got administrator access!", code: "403"});
                //Else proceed to check if token is really valid
                if(!scopes) tokenControllers.checkToken(req.session.token, true, (err, tokenPayload) => {
                    if(err) {
                        //Returns 500 in case of internal server error
                        //or 401 and redirects in case token is invalid
                        if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                        if(err === 2) return res.status(401).redirect(mainHost + "/logout");
                    }
                    if(tokenPayload) commonAuthControllers.checkAdminPassword(tokenPayload.userId, req.body.confirmPassword, (err, valid) => {
                        if(err) {
                            //Returns 500 in case of internal server error
                            //or 401 and redirects to logout route in case of user not found
                            //or blocked or returns 403 in case password is wrong
                            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                            if(err === 2 || err === 3) return res.status(401).redirect(mainHost + "/logout");
                            if(err === 4) return res.status(403).json({msg: "Wrong confirmation password!", code: "403"});
                        }
                        //Setting necessary scopes array to edit candidates
                        var authorizedScopes = ["role:master", "candidate:add_a_edit"];
                        //Checking if user has necessary scopes to edit candidates
                        if(valid) commonAuthControllers.checkScopes(tokenPayload.scopes, authorizedScopes, (validScopes) => {
                            //Return 403 if user is not allowed to edit users
                            if(!validScopes) return res.status(403).json({msg: "You're not allowed to do this action!", code: "403"});
                            //Proceed if all is ok
                            if(validScopes) return proceed();
                        });
                    });
                });
            });
            function proceed() {
                //In case everything is correct reset bruteforce 
                req.brute.reset();
                usersControllers.changeCandidateInfo(req.body.userId, infoArray, (err, success) => {
                    if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    if(success && tokenFirstCheckPayload.userId === req.body.userId) return res.status(200).redirect(mainHost + "/logout?changedInfo=true");
                    if(success && tokenFirstCheckPayload.userId !== req.body.userId) return res.status(200).json({msg: "Success while modifying " + success + "'s info!", code: "200"});
                });
            }
        }
    });
});

candidatesRouter.delete(rootRoute + "/delete",
    globalBruteforce.prevent, 
    userBruteforce.getMiddleware({ 
        //Bruteforce middleware to prevent user from bruteforcing
        //the password used to verify users authenticity to
        //modify data. 
        key: (req, res, next) => {
            next(req.session.token);
        }
    }), (req, res) => {
    //Check if there is empty input
    if(!req.body.userId ||
       !req.body.confirmPassword) return res.status(422).json({msg: "Invalid input!", code: "422"});
    //Check if user is logged in else redirects to login page
    if(!req.session.token) return res.status(401).redirect(mainHost + "/login");
    //Make array with info to save in mongo db
    //Check if token is valid
    tokenControllers.checkToken(req.session.token, false, (err, tokenFirstCheckPayload) => {
        if(err) {
            //Returns 500 in case of internal server error
            //or 401 and redirect in case token is not valid
            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
            if(err === 2) return res.status(401).redirect(mainHost + "/logout");
        }
        //Proceed if token is valid
        if(tokenFirstCheckPayload) {
            //Checks if user is deleting own account
            if(req.body.userId === tokenFirstCheckPayload.userId) tokenControllers.checkCandidateToken(req.session.token, true, (err, tokenPayload) => {
                if(err) {
                    //Returns 500 in case of internal server error
                    //or 401 and redirect in case token is not valid
                    if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    if(err === 2) return res.status(401).redirect(mainHost + "/logout");
                }
                if(tokenPayload) authControllers.checkCandidatePassword(tokenPayload.userId, req.body.confirmPassword, (err, valid) => {
                    if(err) {
                        //Returns 500 in case of internal server error
                        //or 401 and redirects to logout route in case of user not found
                        //or blocked or returns 403 in case password is wrong
                        if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                        if(err === 2 || err === 3) return res.status(401).redirect(mainHost + "/logout");
                        if(err === 4) return res.status(403).json({msg: "Wrong confirmation password!", code: "403"});
                    }
                    if(valid) return proceed();
                });
            });
            //In case it isn't the own user check if user that is deleting is admin
            //or another candidate (because candidates can't modify anyone rather their
            //own account)
            else commonAuthControllers.checkScopes(tokenFirstCheckPayload.scopes, ["role:candidate"], (scopes) => {
                //Returns unauthorized in case user is a candidate
                if(scopes) return res.status(403).json({msg: "You haven't got administrator access!", code: "403"});
                //Else proceed to check if token is really valid
                if(!scopes) tokenControllers.checkToken(req.session.token, true, (err, tokenPayload) => {
                    if(err) {
                        //Returns 500 in case of internal server error
                        //or 401 and redirects in case token is invalid
                        if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                        if(err === 2) return res.status(401).redirect(mainHost + "/logout");
                    }
                    if(tokenPayload) commonAuthControllers.checkAdminPassword(tokenPayload.userId, req.body.confirmPassword, (err, valid) => {
                        if(err) {
                            //Returns 500 in case of internal server error
                            //or 401 and redirects to logout route in case of user not found
                            //or blocked or returns 403 in case password is wrong
                            if(err === 1) return res.status(500).json({msg: "Internal server error!", code: "500"});
                            if(err === 2 || err === 3) return res.status(401).redirect(mainHost + "/logout");
                            if(err === 4) return res.status(403).json({msg: "Wrong confirmation password!", code: "403"});
                        }
                        //Setting necessary scopes array to delete candidates
                        var authorizedScopes = ["role:master", "candidate:delete"];
                        //Checking if user has necessary scopes to delete candidates
                        if(valid) commonAuthControllers.checkScopes(tokenPayload.scopes, authorizedScopes, (validScopes) => {
                            //Return 403 if user is not allowed to delete users
                            if(!validScopes) return res.status(403).json({msg: "You're not allowed to do this action!", code: "403"});
                            //Proceed if all is ok
                            if(validScopes) return proceed();
                        });
                    });
                });
            });
            function proceed() {
                //In case everything is correct reset bruteforce 
                req.brute.reset();
                usersControllers.deleteCandidate(req.body.userId, (err, success) => {
                    if(err) return res.status(500).json({msg: "Internal server error!", code: "500"});
                    if(success && tokenFirstCheckPayload.userId === req.body.userId) return res.status(200).redirect(mainHost + "/logout?deleteUser=true");
                    if(success && tokenFirstCheckPayload.userId !== req.body.userId) return res.status(200).json({msg: "Success while deleting " + success + "!", code: "200"});
                });
            }
        }
    });
});

candidatesRouter.put(rootRoute + "/edit/password",
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
    tokenControllers.checkCandidateToken(req.session.token, true, (err, tokenPayload) => {
        if(err){
            //Return 500 error in case of internal server error
            //or 401 and redirects to logout route
            //in case of invalid token
            if(err === 1) return res.status(500).json({msg: "Internal server erro!", code: "500"});
            if(err === 2) return res.status(401).redirect(mainHost + "/logout");
        }
        //If token is valid, check if verification password is
        //correct 
        if(tokenPayload) authControllers.checkCandidatePassword(tokenPayload.userId, req.body.oldPassword, (err, valid) => {
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
                usersControllers.modifyCandidatePassword(tokenPayload.userId, req.body.newPassword, (err, success) => {
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

candidatesRouter.post(rootRoute + "/block")

module.exports = candidatesRouter;
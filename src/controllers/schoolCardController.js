function schoolCardVerify(cardID, password, callback){
    callback(false, true); //success proceed callback
    //callback(1) -> 403 already voted
    //callback(2) -> 401 invalid credentials 
    //callback(3) -> 500 error
}

module.exports = { schoolCardVerify };
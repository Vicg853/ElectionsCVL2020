function checkAdminAuth(token, callback){
    if(!token) return callback(1);
    if(token != "1234") return callback(1);
    return callback(false, true);
    //callback(1) -> 403 You can not see results yet
    //callback(2) -> 500 error
    //callback(false, true) -> authorized
}

module.exports = { checkAdminAuth };
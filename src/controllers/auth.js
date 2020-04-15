function checkScopes(userScopes, authorizedScopes, callback) {
    var userScopesArray = [];
    var authorizedScopesArray = [];
    if(!Array.isArray(userScopes)) userScopesArray.push(userScopes);
    else userScopesArray = userScopes;
    if (!Array.isArray(authorizedScopes)) authorizedScopesArray.push(authorizedScopes);
    else authorizedScopesArray = authorizedScopes;
    if(callback) callback(userScopesArray.some(element => {
        if(authorizedScopesArray.indexOf(element) >= 0) return element;
    }));
    else return userScopesArray.some(element => {
        if(authorizedScopesArray.indexOf(element) >= 0) return true;
    });
}

module.exports = {
    checkScopes,
};
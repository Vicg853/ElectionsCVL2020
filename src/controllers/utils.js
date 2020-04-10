function arraysMatch(arr1, arr2) {
    //Check first if have same length and are actually
    //arrays or objects
    if (!Array.isArray(arr1) || 
        !Array.isArray(arr2) || 
        arr1.length !== arr2.length) return false;
    //Put in order
    var arr1Concat = arr1.concat().sort();
    var arr2Concat = arr1.concat().sort();
    //Check if have same values
    for (var i = 0; i < arr1.length; i++) {
        if (arr1Concat[i] !== arr2Concat[i]) return false;
    }
    return true;
};

module.exports = {
    arraysMatch
};
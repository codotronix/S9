/*
* function Name: extractStringVars
* function Job: this function goes thru the S9 Source Code and replaces all strings with a variable
                and also stores that variable name and string value in a key value pair for later replacement
*/
function extractStringVars (source) {
    var allStringVars = {};
    var modifiedSource = '';

    var doubleQuoteOpen = false;
    var singleQuoteOpen = false;
    var stringVarNum = 0;        
    var stringVar = '';

    for(i in source) {            
        //when a double " is opening a quote
        if (source[i] == '"' && source[i-1] != '\\' && !singleQuoteOpen) {              
            if (!doubleQuoteOpen) {
                doubleQuoteOpen = true;
                stringVarNum++;
            } else {
                doubleQuoteOpen = false;
                var tempKey = "____stringVar_____" + stringVarNum;
                allStringVars[tempKey] = stringVar;
                stringVar = '';
                modifiedSource += " " + tempKey + " "; 
            }                
        } 
        else if (source[i] == "'" && source[i-1] != "\\" && !doubleQuoteOpen) {                
            if (!singleQuoteOpen) {
                singleQuoteOpen = true;
                stringVarNum++;
            } else {
                singleQuoteOpen = false;
                var tempKey = "____stringVar_____" + stringVarNum;
                allStringVars[tempKey] = stringVar;
                stringVar = '';
                modifiedSource += " " + tempKey + " "; 
            }                
        } 
        else {
            if (doubleQuoteOpen || singleQuoteOpen) {
                stringVar += source[i];
            } else {
                modifiedSource += source[i];
            }
        }
    }
    
    var retObj = {};
    retObj.allStringVars = allStringVars;
    retObj.modifiedSource = modifiedSource;
    return(retObj);
}
    /////////////////////////////////////////////////////////////////////////////////
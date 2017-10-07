(function(){
    // APIs
    S9.codeCleanup = S9.codeCleanup || {};
    S9.codeCleanup.identifyStringsAndComments = identifyStringsAndComments;
    S9.codeCleanup.removeComments = removeComments;
    S9.codeCleanup.cleanCode = cleanCode;


    /*
    * One wrapper code to wrap all functions
    */
    function cleanCode () {
        identifyStringsAndComments();
        removeComments();
    }


    /*
    * It will take the raw src code
    * Identify the Strings and Comments
    * Store them in 
    *   S9.vars.strings
    *   S9.vars.comments
    *
    * And put approriate token names in cleaned src
    */
    function identifyStringsAndComments (src) {
        var src = src || S9.code.src;
        res = '';

        var currentlyOpen = undefined;
        var tempStringHolder = '';
        var tempCommentHolder = '';

        for (var i = 0; i < src.length; i++) {

            //if a double quote is found, which is not escaped
            //and currentlyOpen is not comment
            if(src[i] === '"' && src[i-1] !== '\\' && currentlyOpen !== 'comment' && currentlyOpen !== 'double-comment') {

                //check if it is opening string
                if(currentlyOpen !== 'string') {
                    currentlyOpen = 'string';
                }
                //if it is a closing string
                //add the temporary string to string variable storage
                //and initialize the tempStringHolder
                else {
                    S9.vars.strings[++S9.vars.count.string] = tempStringHolder;
                    tempStringHolder = '';
                    currentlyOpen = undefined;
                    res += ' __S9__string_' +  S9.vars.count.string;
                }
            }

            //if a /* is found and currentlyOpen is not a string 
            else if (src[i] === '/' && src[i+1] === '*' && currentlyOpen !== 'string' && currentlyOpen !== 'double-comment') {
                i++;
                currentlyOpen = 'comment';
            }

            //if a */ is found and currentlyOpen is comment
            //or
            // \n is found and currentlyOpen is double-comment
            else if ((src[i] === '*' && src[i+1] === '/' && currentlyOpen === 'comment') || (src[i+1] === '\n' && currentlyOpen === 'double-comment')) {
                i++;                
                S9.vars.comments[++S9.vars.count.comment] = tempCommentHolder;
                tempCommentHolder = '';

                res += ' __S9__comment_' +  S9.vars.count.comment;

                if(currentlyOpen === 'double-comment') {
                    res += '\n';
                }

                currentlyOpen = undefined;
            }

            //if double comment // is found and no comment or string is open
            //then start a double comment
            else if (src[i] === '/' && src[i+1] === '/' && currentlyOpen !== 'string' && currentlyOpen !== 'comment') {
                i++;
                currentlyOpen = 'double-comment';
            }

            else if (currentlyOpen === 'comment' || currentlyOpen === 'double-comment') {
                tempCommentHolder += src[i];
            }

            else if (currentlyOpen === 'string') {
                tempStringHolder += src[i];
            }

            else {
                res += src[i];
            }
        }


        //Sometimes if a src-file is not ending with \n
        // a double comment can be lost
        //So, proactively look for it
        if(currentlyOpen === 'double-comment' && tempCommentHolder.trim().length > 0) {
            currentlyOpen = undefined;
            S9.vars.comments[++S9.vars.count.comment] = tempCommentHolder;
            tempCommentHolder = '';

            res += ' __S9__comment_' +  S9.vars.count.comment + '\n';
        }

        S9.code.commentsMarkedSrc = res;
        return S9.code.commentsMarkedSrc;
    }


    /*
    * It will remove all the identified comments from cleaned src
    * the comments are identified in the function identifyStringsAndComments
    */
    function removeComments () {

        //Force all the scope opening and closing in new lines
        //i.e. 1 line will contain only 1 { or } only
        //and nothing else
        S9.code.commentsMarkedSrc = S9.code.commentsMarkedSrc.replace(/[{]/g, '\n{\n');
        S9.code.commentsMarkedSrc = S9.code.commentsMarkedSrc.replace(/[}]/g, '\n}\n');
        S9.code.commentsMarkedSrc = S9.code.commentsMarkedSrc.replace(/[;]/g, ';\n');

        var lines = S9.code.commentsMarkedSrc.split('\n');
        var res = [];
        var tempLine = undefined;

        for (var i in lines) {
            tempLine = lines[i];

            //remove comments if any
            if(tempLine.indexOf('__S9__comment_') >= 0) {
                tempLine = tempLine.substr(0, tempLine.indexOf('__S9__comment_'));
            }

            //if still tempLine has something in it, then take it
            if(tempLine.trim().length > 0) {
                res.push(tempLine);
            }
        }

        S9.code.commentsFreeSrc = res.join('\n');
        return S9.code.commentsFreeSrc;
    }

})
(S9 = S9 || {});
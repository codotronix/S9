(function(){
    //keep track of current scope
    //var scope = 0;    

    S9.interpreter.interpret = interpret;
    S9.interpreter.interpretSrc = interpretSrc;
    S9.interpreter.interpretSingleLine = interpretSingleLine;
    S9.interpreter.infixToPostfix = infixToPostfix;
    S9.interpreter.processExpression = processExpression;

    var precedence = {
                        '/': 3,
                        '*': 3,
                        '+': 2,
                        '-': 2
                    };

    function interpret (src) {
        S9.code.src = src;
        S9.codeCleanup.cleanCode();
        S9.interpreter.interpretSrc();
    }

    function interpretSrc (src) {
        var lines = (src || S9.code.commentsFreeSrc).split('\n');
        
        for(var i in lines) {
            interpretSingleLine(lines[i].trim());
        }
    }

    function interpretSingleLine (line) {

        //is a scope starting?
        if(line.indexOf('{') >= 0) {
            //scope++;
        }

        //is a scope ending?
        else if(line.indexOf('}') >= 0) {
            //scope--;
        }

        //if it is a num variable initialization
        else if (line.startsWith('num')) {
            initializeNumber(line);
        }
    }

    function initializeNumber (line) {
        //remove the "num " keyword from begining
        var numVars = line.substr(4).split(',');
        var tempVar, tempVarName, tempVarVal;

        for (var i in numVars) {            

            //contains =, means it has initialization
            if (numVars[i].indexOf('=') >= 0) {
                tempVar = numVars[i].split('=');
                tempVarName = tempVar[0].trim();

                //the initilization value can ba an expression in itself
                //So, basically tempVar[1] needs to be processed
                //But temporarily we are assuming it to be a floating number
                tempVarVal = parseFloat(processExpression(tempVar[1].trim()));
            }
            else {
                tempVarName = numVars[i].trim();
                tempVarVal=0;
            }

            S9.vars.nums[tempVarName] = tempVarVal;
        }

    }


    /*
    * This is the heart. The processor.
    * It will make the parse tree and process expression
    */
    function processExpression (exp) {
        tokensArr = infixToPostfix(exp);
        return evaluatePostfix(tokensArr);
    }


    /*
    * While reading the expression from left to right, 
    * push the element in the stack if it is an operand.
    * Pop the two operands from the stack, 
    * if the element is an operator and then evaluate it.
    * Push back the result of the evaluation. 
    * Repeat it till the end of the expression.
    */
    function evaluatePostfix (tokensArr) {
        var stack = [];
        var temp;

        for(var i in tokensArr) {

            //if operand, push to stack
            if(precedence[tokensArr[i]] === undefined) {
                stack.push(tokensArr[i]);
            }
            else {
                temp = evaluate(tokensArr[i], stack[stack.length-2], stack[stack.length-1]);
                stack.splice(stack.length-2, 2);
                stack.push(temp);
            }
        }

        return stack[0];
    }


    function getValueOfOperand (op) {
        op = isNaN(op) ? (S9.vars.nums[op] || S9.vars.string[op]) : parseFloat(op);
        return op;
    }


    function evaluate (operator, op1, op2) {
        op1 = getValueOfOperand(op1);
        op2 = getValueOfOperand(op2);
        var res;

        switch(operator) {
            case "/":
                res = op1 / op2;
                break;
            case "*":
                res = op1 * op2;
                break;
            case "+":
                res = op1 + op2;
                break;
            case "-":
                res = op1 - op2;
                break;
            default:
                console.log('bad operator ' + operator);
        }

        return res;
    }


    function infixToPostfix (exp) {
        var tokens = parseTheTokens(exp);
        //var operators = "-+*/";     //higher the index, greater the precedence
        
        var result = [], stack = [];

        //go thru each token
        for (var i in tokens) {

            //if the scanned character is an ‘(‘, push it to the stack
            if (tokens[i] === '(') {
                stack.push(tokens[i]);
            }

            //if the scanned character is an ‘)’,
            //pop and output from the stack until an ‘(‘ is encountered
            else if (tokens[i] === ')') {
                while (stack[stack.length - 1] !== '(') {
                    result.push(stack[stack.length-1]);
                    stack.splice(stack.length-1, 1);
                }

                //also remove the '(' from stack
                stack.splice(stack.length-1, 1);
            }

            //if token is operand, push it in result
            else if (precedence[tokens[i]] === undefined) {
                result.push(tokens[i]);
            }
            
            //else if operator
            else {

                //if the operator has lower precedence than last operator on stack
                //then add all the stacked operators to result
                //Pop the operator from the stack until the precedence of the 
                //scanned operator is less-equal to the precedence of the operator 
                //residing on the top of the stack. Push the scanned operator to the stack.
                while(stack.length > 0 && precedence[tokens[i]] <= precedence[stack[stack.length - 1]]) {
                    result.push(stack[stack.length-1]);
                    stack.splice(stack.length-1, 1);                    
                }

                stack.push(tokens[i]);
            }
        }

        //when all tokens are traversed, empty the stack to result
        while (stack.length > 0) {
            result.push(stack[stack.length-1]);
            stack.splice(stack.length-1, 1);
        }

        return result;
    }


    function parseTheTokens (exp) {
        //inject extra spaces 
        //a.replace(/([*+-])/g, "\x20$1\x20");
        exp = exp.replace(/[ ]+/g, ' ');
        var operators = "()/*+-";
        var tokens = [];
        var tempToken = '';

        for(var i in exp) {
            if(exp[i] === ' ') {
                if(tempToken.trim().length > 0) {
                    tokens.push(tempToken.trim());
                    tempToken = '';
                }                
            }
            else if (operators.indexOf(exp[i]) >= 0) {
                if(tempToken.trim().length > 0) {
                    tokens.push(tempToken.trim());
                    tempToken = '';
                }
                tokens.push(exp[i]);
            }
            else {
                tempToken += exp[i];
            }
        }

        if(tempToken.trim().length > 0) {
            tokens.push(tempToken);
        }

        return tokens;
    }

})();
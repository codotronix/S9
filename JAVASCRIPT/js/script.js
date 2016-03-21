$(function(){
    /************************************************************************************
    ************ All Global variables ***************************************************
    ************************************************************************************/
    var s9 = {};
    s9.source = '';    
    //s9.modifiedSource = '';
    s9.allStringVars = {};
    /////////////////////////////////////////////////////////////////////////////////////
    
    function startProcessing (sourceCode) {
        s9.source = sourceCode.trim();
        var retObj = extractStringVars(s9.source);
        s9.source = retObj.modifiedSource;
        s9.allStringVars = retObj.allStringVars;
        s9.source = removeComments(s9.source);
        
        console.log(s9);
    }
    
    
    function removeComments (source) {
        source = source.replace(/\/\*(.*)\*\/|\/\/(.*)/gm, '');
        return(source);
    }
    
    
    
    //console.log('loaded...');
    $('#do').click(function(){
        var inputTxt = $('#in').val();
        startProcessing(inputTxt);
        //console.log(inputTxt);
    });
    
    $('#clear').click(function(){
        $('#in').val('');
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
})
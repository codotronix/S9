$(function(){
    $('#interpret').on('click', function(){
        startInterpret($('#src-code').val());
    });


    function startInterpret (src) {
        S9.interpreter.interpret(src);

        $('#comment-string-identified-code').val(S9.code.commentsMarkedSrc);
        $('#comment-free-code').val(S9.code.commentsFreeSrc);
    }

});
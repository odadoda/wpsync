$(function(){

    $('.js_import').click(function(){
        var form = $(this).parent('form');
        var url = form.attr('action');
        $.post(url, form.serialize()).done(function(result){
            console.log('somethings done' + result);
        });
    });
    
});
$(function(){

    $('.js_import').click(function(event){
        event.preventDefault();
        var form = $(this).parent('form');
        var url = form.attr('action');
        var wordpresspostid = $(this).siblings('input[name="wordpressid"]').val();
        var action = $(this).val();
        $.post(url, {wordpressid: wordpresspostid, action: action}).done(function(result){
            var parentRow = form.parents('tr');
            parentRow.css('color', 'skyblue');
        }).error(function(){
            var parentRow = form.parents('tr');
            parentRow.css('color', 'red');
        });
    });
    
});
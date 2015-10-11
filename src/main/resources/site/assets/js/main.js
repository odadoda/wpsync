$(function(){

    $('.js_import').click(function(event){
        event.preventDefault();
        var form = $(this).parent('form');
        var url = form.attr('action');
        var wordpressid = $(this).siblings('input[name="wordpressid"]').val();
        
        var action = $(this).val();
        $.post(url, {wordpressid: wordpressid, action: action}).done(function(result){
            var parentRow = form.parents('tr');
            parentRow.css('color', 'skyblue');
            form.hide();
        }).error(function(){
            var parentRow = form.parents('tr');
            parentRow.css('color', 'red');
        });
    });
    
});
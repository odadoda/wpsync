
/* Pack libs into one object to not confuse yourself */
var libs = {
    util: require('/lib/enonic/util/util'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    portal:require('/lib/xp/portal'),
    sync: require('/lib/wpsync/wpsync')
};


exports.get = function(req){
    
    var view = resolve('wordpress-import.html');
    
    var page = libs.portal.getContent();
    
    libs.util.log(page.page.config);
    
    
    var status = 'End point not set';
    libs.util.log(typeof(page.page.config.wordpressEndPoint));
    if( typeof(page.page.config.wordpressEndPoint) != 'undefined' && page.page.config.wordpressEndPoint.length() > 0 ){
        status = 'End point set to: ' + page.page.config.wordpressEndPoint;
        
        // get posts
        var wordpressPosts = libs.sync.getWPPosts(page.page.config.wordpressEndPoint);    
    }

        
    
    var params = {
        title: 'pewpew title',
        status: status
    }
    
    
    return {
        body: libs.thymeleaf.render(view, params),
        contentType: 'text/html'
    };
    
};
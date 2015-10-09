
/* Pack libs into one object to not confuse yourself */
var libs = {
    util: require('/lib/enonic/util/util'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    portal:require('/lib/xp/portal'),
    sync: require('/lib/wpsync/wpsync'),
    content: require('/lib/xp/content')
};



exports.get = function(req){
    libs.util.log("~~ get ~~");
    var content = libs.portal.getContent();
    
    libs.util.log(content);
    var status = 'End point not set';
    var wordpressPosts = {};
    
    if( typeof(content.page.config.wordpressEndPoint) != 'undefined' && content.page.config.wordpressEndPoint.length() > 0 ){
        status = 'End point set to: ' + content.page.config.wordpressEndPoint;
        // get posts
        wordpressPosts = libs.sync.getWPPosts(content.page.config.wordpressEndPoint);    
    }

        
    var putUrl = libs.portal.pageUrl({
        path: content.path 
    });
    
    var params = {
        title: 'pewpew title',
        status: status,
        wordpressposts: wordpressPosts,
        putUrl: putUrl
    }
    
    var view = resolve('wordpress-import.html');
    
    
    return {
        body: libs.thymeleaf.render(view, params),
        contentType: 'text/html'
    };
};

exports.post = function(req){
    libs.util.log("~~ post ~~");
    var wordpressid = req.params.wordpressid;
    var action = req.params.action;
    
    if(action === 'put'){
        putPost(wordpressid);
    }
    
    return {
        body: '{result: "OK"}',
        contentType: 'text/html'
    }   
    
}


function putPost(wordpresspostid){
    var content = libs.portal.getContent()
    var wordpressPost = getPost(content.page.config.wordpressEndPoint, wordpresspostid);
    //libs.util.log(wordpressPost);
    
    var target = '/';
    
    if(typeof(content.page.config.targetDirectory) != 'undefined' && content.page.config.targetDirectory.length > 0 ){
        var directory = libs.content.get({ key : content.page.config.targetDirectory });
        target = directory._path
    }
    

    var returnJson = libs.content.create({
        name: wordpressPost.slug,
        parentPath: target,
        displayName: wordpressPost.title,
        requireValid: true,
        contentType: app.name + ':wordpresspost',
        data: {
            title: wordpressPost.title,
            id: wordpressPost.ID,
            content: wordpressPost.content,
            date: wordpressPost.date,
            modified: wordpressPost.modified,
        }
        
        
    });

    return returnJson;
    
}


function getPost(endpoint, id){
    return libs.sync.getWPPost(endpoint, id);
}
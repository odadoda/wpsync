
/* Pack libs into one object to not confuse yourself */
var libs = {
    util: require('/lib/enonic/util/util'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    portal:require('/lib/xp/portal'),
    sync: require('/lib/wpsync/wpsync'),
    content: require('/lib/xp/content')
};


/*
*   Get
*/
exports.get = function(req){
    
    var content = libs.portal.getContent();
    var status = 'End point not set';
    var wordpressPosts = {};
    
    //  check and see if we have an endpont to scrape data from
    if( typeof(content.page.config.wordpressEndPoint) != 'undefined' && content.page.config.wordpressEndPoint.length() > 0 ){
        status = 'End point set to: ' + content.page.config.wordpressEndPoint;
        // get posts with javaplugin
        wordpressPosts = libs.sync.getWPPosts(content.page.config.wordpressEndPoint);    
    }
    
    // check and see if a target direectory is set so i can check if the content is already imported.
    var targetDir = getTargetDirectory();
    var alreadyImportedContent = libs.content.getChildren({
        key: targetDir,
        count: 1000
    });
    
    libs.util.log(alreadyImportedContent);
    
    
    
    for(var i = 0; i < wordpressPosts.length; i++){
        libs.util.log(wordpressPosts[i]['ID']);
        for(var k = 0; k < alreadyImportedContent.hits.length; k++){
            if(alreadyImportedContent.hits[k].data.id == wordpressPosts[i]['ID']){
                wordpressPosts[i].isImported = true;
            }    
        }
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


/*
*   Post
*
*/
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


/*
*   Functions
*/
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
        branch: "draft",
        
        data: {
            title: wordpressPost.title,
            content: wordpressPost.content,
            id: wordpressPost.ID,
            date: wordpressPost.date,
            modified: wordpressPost.modified,
        }
        
        
    });

    libs.util.log(returnJson);

    return returnJson;
    
}


function getPost(endpoint, id){
    return libs.sync.getWPPost(endpoint, id);
}

function getTargetDirectory(){
    var content = libs.portal.getContent();
    var target = '/';
    if(typeof(content.page.config.targetDirectory) != 'undefined' && content.page.config.targetDirectory.length > 0 ){
        var directory = libs.content.get({ key : content.page.config.targetDirectory });
        target = directory._path
    }
    return target;
}


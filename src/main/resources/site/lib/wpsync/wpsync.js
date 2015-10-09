/*
exports.sync = {
    getWPPosts: function(wordpressEndPoint){
        var bean = __.newBean("no.tac.wpsync.Wpsyng");
        var result = bean.getAllPosts(wordpressEndPoint);
        return JSON.parse(result);
    }
}
*/



exports.getWPPosts = function(wordpressEndPoint){
    var bean = __.newBean("no.wpsync.Wpsync");
    var result = bean.getAllPosts(wordpressEndPoint);
    return JSON.parse(result);

};

exports.getWPPost = function(wordpressEndPoint, id){
    var bean = __.newBean("no.wpsync.Wpsync");
    var result = bean.getPost(wordpressEndPoint, id);
    return JSON.parse(result);

};
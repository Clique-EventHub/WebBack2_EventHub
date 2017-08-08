var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var Event = require('mongoose').model('Event');

const storagePath = require('../../config/config').storagePath;
//route POST /tags/modify
exports.modifyTag = function(request,response){
    var info = {};
	mkdirp(path.join(__dirname,storagePath),function(err){
		if(err){
            info.msg ="error";
            response.status(500).json(info);
            return next(err);
		}
        else{
            // modify tags type in file
			fs.writeFile(path.join(__dirname,`${storagePath}tags.json`),JSON.stringify(request.body,null,2),function(err){
				if(err){
                    console.log(err);
                    info.msg = "error2";
                    response.status(500).json(info);
				}
                else {
                    info.msg = 'done';
                    response.status(200).json(info);
			    }
            });
		}
	});
}

//route GET /tags
//return type of tags
exports.getTags = function(request,response,next){
	response.sendFile(path.join(__dirname,'../../data/tags.json'),function(err){
    if(err){
      var error = {};
      error.msg = "error in sending file";
      console.error("error in sending file");
      response.status(500).json(error);
      return next(err);
    }
    else{
      console.log("Sent tags.json");
    }
  });
}

//route GET /tags/search?keywords=k1,k2,k3...
exports.searchTag = function(request,response,next){
        var keys = request.query.keywords.split(',');
        console.log(keys);
        var info={};
        //event tags match all keywords and tokenDelete is false
        Event.find( { $and : [ {tags: {$all : keys }}, {tokenDelete: false} ] },
            function(err,events){
                if(err){
                    info.msg = "error";
                    response.status(500).json(info);
                    return next(err);
                }
                else if(events.length==0){
                    info.msg = "event not found";
                    console.error("event not found on tags : searchTag - tag.controllers");
                    response.status(404).json(info);
                }
                else {
                    var fields = ['_id','title','picture','channel','tags'];
                    info.events = [];
                    for(var j=0; j<events.length;j++){
                            info.events.push({});
                            for(var i=0; i<fields.length; i++){
                                    info.events[j][fields[i]] = events[j][fields[i]];
                            }
                    }
                    // info is { events : [ {event},{},{},...] }
                    if(request.user){
											if(request.user.notification != undefined && request.user.notification != null){
												info.notification = request.user.notification;
												response.status(200).json(info);
											}
											else{
												response.status(200).json(info);
											}
										}
										else{
											response.status(200).json(info);
										}
                }
        });
}

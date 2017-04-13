var fs = require('fs');
var multer = require('multer');
var path = require('path');
var Event = require('mongoose').model('Event');
var Channel = require('mongoose').model('Channel');
var mkdirp = require('mkdirp');
var config = require('../../config/config');

//route POST /picture?size=...&field=... with req body
exports.postPicture= function(request,response,next){
	var info={};
	var PORT = config.PORT === 80 ? '' : ':'+config.PORT;
	dest = './pictures/'+request.query.field;
	dest += (request.query.size=='large') ? '/large' : '/small';
	//such a callback hell
	info.msg = 'file is not valid';
	mkdirp(dest,function(err){ // save picture on filesystem
		if(err){
			info.msg = "something went wrong";
			console.error("error mkdirp : postPicture - picture.controllers");
			response.json(info);
			return next(err);
		}
		else{
			//path to save picture
			var storage = multer.diskStorage({
				destination: function(request,file,callback){
					callback(null,dest);
				},
				filename: function(request,file,callback){
					callback(null,(Math.random()+1).toString(36).substring(7)+Date.now()+path.extname(file.originalname));
				}
			});
			//upload is first-class function
			var upload = multer({storage:storage}).single('picture');
			//upload to event folder
			if(request.query.field=='event'){
				Event.findById(request.query.id,function(err,event){
					if(err) {
						info.msg = "error find event : postPicture - picture.controllers";
						console.error("error find event : postPicture - picture.controllers");
						response.json(info);
						return next(err);
					}
					else if(!event){
						console.error("event not found : postPicture - picture.controllers");
						info.msg = "event not found : postPicture - picture.controllers";
						response.json(info);
					}
					else{
						// upload picture
						upload(request,response,function(err){
						 	if(err){
						 		info.msg = "something went wrong";
						 		console.error("error upload0 : postPicture - picture.controllers");
						 		response.json(info);
						 		return next(err);
						 	}
						 	else{
								url = 'http://'+config.IP+PORT+'/picture/'+request.query.field[0] + request.query.size[0] +request.file.filename;
								//save picture url to event
								if(request.query.size=='small') event.picture = url;
								else event.picture_large.push(url);
								//update event
								event.update(event,function(err){
									if(err){
										info.msg = "something went wrong";
										response.json(info);
										console.error("error update event : postPicture - picture.controllers");
										return next(err);
									}
									else {
										info.msg = 'done';
										info.url = url;
										response.status(201).json(info);
									}
								});
							}
						});
					}
				});
			}
			// upload to channel folder
			else{
				Channel.findById(request.query.id,function(err,channel){
					if(err){
						info.msg = 'error';
						response.json(info);
						console.error("error find channel : postPicture - picture.controllers");
						return next(err);
					}
					else if(!channel){
						info.msg = 'channel not found';
						response.json(info);
						console.error("channel not found : postPicture - picture.controllers");
					}
					else{
						upload(request,response,function(err){
							if(err){
								info.msg = "something went wrong";
								response.json(info);
								console.error("error upload1 : postPicture - picture.controllers");
								return next(err);
							}
							else{
								url = 'http://'+config.IP+PORT+'/picture/'+request.query.field[0] + request.query.size[0] +request.file.filename;
								// save picture url to channels
								if(request.query.size=='small')	channel['picture']=url
								else channel['picture_large']=url;
								// update channel
								channel.update(channel,function(err){
									if(err) {
										info.msg = "something went wrong";
										reponse.json(info);
										return next(err);
									}
									else{
										info.msg = "done";
										info.url = url;
										response.status(201).json(info);
									}
								});
							}
						});
					}
				});
			}
		}
	});
}

// route GET /picture/:name
exports.getPicture = function(request,response,next){
	dest = '../../pictures/';
	dest += request.params.name[0] == 'e' ? 'event/' : 'channel/';
	dest += request.params.name[1] == 's' ? 'small/' : 'large/';
	response.sendFile(path.join(__dirname,dest,request.params.name.substr(2,request.params.name.length)),function(err){
    if(err){
      var error = {};
      error.msg = "error in sending file";
      console.error("error in sending file");
      response.status(500).json(error);
      return next(err);
    }
    else{
			var picname = request.params.name;
      console.log("Sent : "+picname);
    }
  });
}

// route DELETE /picture/:name?id=...(event's id)
exports.deletePicture = function(request,response,next){
	var id = request.query.id;
	var field = request.params.name[0] == 'e' ? 'event' : 'channel';
	var size = request.params.name[1] == 's' ? 'small' : 'large';
	var name = request.params.name.substr(2,request.params.name.length);
	var tmppath = '../../pictures/'+field+'/'+size;
	var oldpath = path.join(__dirname,tmppath,name);
	var newpath = path.join(__dirname,'../../pictures/bin/',name);
	var info = {};
	var PORT = config.PORT === 80 ? '' : ':'+config.PORT;
	//move picture to folder bin
	mkdirp(path.join(__dirname,'..	/../pictures/bin'),function(err){
		if(err){
			info.msg = "error";
			console.error("error mkdirp : deletePicture - picture.controllers");
			response.json(info);
			return next(err);
		}
		else{
			//remove picture url in event
			Event.findById(request.query.id,function(err,event){
				if(err){
					info.msg = 'error';
					response.json(info);
					return next(err);
				}
				else if(!event) {
					info.msg = 'event not found'
					response.json(info);
				}
				else{
					if(size=='small') event.picture=null;
					else {
						var index = event.picture_large.indexOf('http://'+config.IP+PORT+'/picture/'+request.params.name);
						if(index>-1) event.picture_large.splice(index,1);
					}
					event.update(event,function(err){
						if(err){
							info.msg = 'error1';
							response.json(info);
							return next(err);
						}
						else{
							if(fs.existsSync(oldpath)){
								fs.rename(oldpath,newpath,function(err){
									if(err){
										info.msg = 'error2'
										response.json(info);
										return next(err);
									}
									else{
										info.msg = 'done';
										response.json(info);
									}
								});
							}
							else{
								info.msg = 'picture is not found';
								response.json(info);
							}
						}
					});
				}
			});
		}
	});
}

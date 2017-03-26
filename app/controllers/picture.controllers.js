var fs = require('fs');
var multer = require('multer');
var path = require('path');
var Event = require('mongoose').model('Event');
var Channel = require('mongoose').model('Channel');
var mkdirp = require('mkdirp');
var config = require('../../config/config');

//route POST /picture?size=...&field=... with req body
exports.postPicture= function(request,response,next){

	dest = './pictures/'+request.query.field;

	dest += (request.query.size=='large') ? '/large' : '/small';
	//such a callback hell
	mkdirp(dest,function(err){ // save picture on filesystem
		if(err){
			response.send("something went wrong");
			console.error("error mkdirp : postPicture - picture.controllers");
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
						console.error("error find event : postPicture - picture.controllers");
						return next(err);
					}
					else if(!event){
						console.error("event not found : postPicture - picture.controllers");
						response.send('event not found');
					}
					else{
						// upload picture
						upload(request,response,function(err){
						 	if(err){
						 		response.send("something went wrong");
						 		console.error("error upload0 : postPicture - picture.controllers");
						 		return next(err);
						 	}
						 	else{
								url = 'http://'+config.IP+':'+config.PORT+'/picture/'+request.file.filename+'?field='+request.query.field+'&size='+request.query.size;
								//save picture url to event
								if(request.query.size=='small') event.picture = url;
								else event.picture_large.push(url);
								//update event
								event.update(event,function(err){
									if(err){
										response.send("something went wrong");
										console.error("error update event : postPicture - picture.controllers");
										return next(err);
									}
									else response.status(201).send('done');
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
						response.send("error");
						console.error("error find event : postPicture - picture.controllers");
						return next(err);
					}
					else if(!channel){
						response.send('channel not found');
						console.error("channel not found : postPicture - picture.controllers");
					}
					else{
						upload(request,response,function(err){
							if(err){
								response.send("something went wrong");
								console.error("error upload1 : postPicture - picture.controllers");
								return next(err);
							}
							else{
								url = 'http://'+config.IP+':'+config.PORT+'/picture/'+request.file.filename+'?field='+request.query.field+'&size='+request.query.size;
								// save picture url to channels
								if(request.query.size=='small')	channel['picture']=url
								else channel['picture_large']=url;
								// update channel
								channel.update(channel,function(err){
									if(err) return next(err);
									else response.status(201).send('done');
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
exports.getPicture = function(request,response){
	dest = '/../pictures/'+request.query.field+'/'+request.query.size;
	response.sendFile(path.join(__dirname,dest,request.params.name));
}

// route DELETE /picture/:name?id=...(event's id)
exports.deletePicture = function(request,response,next){
	var id = request.query.id;
	var tmppath = '/../pictures/'+request.query.field+'/'+request.query.size;
	var oldpath = path.join(__dirname,tmppath,request.params.name);
	var newpath = path.join(__dirname,'/../pictures/bin/',request.params.name);

	//move picture to folder bin
	mkdirp(path.join(__dirname,'/../pictures/bin'),function(err){
		if(err) return next(err);
		else{
			//remove picture url in event
			Event.findById(request.query.id,function(err,event){
				if(err){
					response.send("error");
					return next(err);
				}
				else if(!event) response.send('event not found');
				else{
					if(request.query.size=='small') event.picture=null;
					else event.picture_large.splice(event.picture_large.indexOf('http://'+config.IP+':'+config.PORT+'/picture/'+request.params.name+'?field='+request.query.field+'&size='+request.query.size),1);
					event.update(event,function(err){
						if(err){
							response.send("error1");
							return next(err);
						}
						else{
							fs.rename(oldpath,newpath,function(err){
								if(err){
									response.send("error2");
									return next(err);
								}
								else{
									response.send('done');
								}
							});
						}
					});
				}
			});
		}
	});
}

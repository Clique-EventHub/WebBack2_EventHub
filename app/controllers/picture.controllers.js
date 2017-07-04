var fs = require('fs');
var multer = require('multer');
var path = require('path');
var Event = require('mongoose').model('Event');
var Channel = require('mongoose').model('Channel');
var mkdirp = require('mkdirp');
var config = require('../../config/config');
var checkPermission = require('../../config/utility').checkPermission;
var findMODEL = require('../../config/utility').findMODEL;
const maxCoverPhotoSize = require('../../config/config').maxCoverPhotoSize;
const maxAvatarSize = require('../../config/config').maxAvatarSize;
const picturePath = path.join(__dirname,'../../','data/pictures/');
const mongoIDsize = 24;

//route POST /picture?size=...&field=... with req body
exports.postPicture= function(request,response,next){
	
	let id = request.query.id;
	let field = request.query.field;
	let size = request.query.size;
	let maxFileSize = size === "small" ? maxAvatarSize : maxCoverPhotoSize; 
	console.log(request);
	if(!id || !field || !size){
		response.status(403).json({err:"Please provide id, field and size"});
		return;
	}
	else if(["event","channel"].indexOf(field) < 0){
		response.status(403).json({err:"invalid field"});
		return;
	}
	else if(["small","large"].indexOf(size) < 0){
		response.status(403).json({err:"invalid field"});
		return;
	}

	
	// sorry for callback hell
	checkPermission(request, id, field, (info) => {
		console.log('post picture...',new Date());
		if(info.err){
			response.status(403).json(info);
			return;
		}
		info = {};
		dest = `${field}/${id}`;
		//such a callback hell
		info.err = 'file is not valid';
		console.log('uploading...');
		mkdirp(`${picturePath}${dest}`,function(err){ // save picture on filesystem
			if(err){
				info.err = "internal error postPicture";
				console.error("error mkdirp : postPicture - picture.controllers");
				response.status(500).json(info);
				return;
				// return next(err);
			}
			else{
				//path to save picture
				var storage = multer.diskStorage({
					destination: function(request,file,callback){
						callback(null,`${picturePath}${dest}`);
					},
					filename: function(request,file,callback){
						callback(null,(Math.random()+1).toString(36).substring(7)+Date.now()+path.extname(file.originalname).toLowerCase());
					}
				});
				//upload is first-class function
				var upload = multer({
					storage:storage,
					limits:{
						fileSize: maxFileSize
					}
				}).single('picture');
				//upload to model folder

				findMODEL(id,field,(err,model) =>{
					if(err){
						console.error(new Date().toString());
						console.error(err);
						response.status(err.code).json(err);
						return;
					}
					else{
						// upload picture
						upload(request,response,function(err){
							if(err){
								//info.err = "something went wrong";
								if(err.message === "File too large") info.err = `File is too large. The maximum size is ${maxFileSize/1000000}MB.`;
								console.error("error upload0 : postPicture - picture.controllers");
								console.error(err);
								response.status(500).json(info);
								return;
								// 	return next(err);
							}
							else{
								let url = config.URL + '/picture/'+ field[0] + size[0] + id + request.file.filename;
								//save picture url to model 
								new Promise( (resolve,reject) => {
									console.log('check size');
									if(size=='small'){
										let len = `${config.URL}/picture/fs${id}`.length;
										if(!model.picture){
											model.picture = url;
											resolve();
										} 
										else{
											name = model.picture.substr(len ,model.picture.length );
											deletePicture(id, field, size, name, (err) => {
												if(err) reject(err);	
												else{
													model.picture = url;
													resolve();
												}
											});
										}
									} 
									else if(size === 'large'){
										model.picture_large.push(url);
										resolve();									
									}
									else reject({err:"invalid size"});
								}).then( () => {
									//update model
									console.log('updating model...');
									model.update(model,function(err){
										if(err){
											info.err = "something went wrong";
											response.status(500).json(info);
											console.error("error update model : postPicture - picture.controllers");
											return;
											// return next(err);
										}
										else {
											info.err = 'done';
											info.url = url;
											if(request.user){
												if(request.user.notification != undefined && request.user.notification != null){
													info.notification = request.user.notification;
												}
											}
											response.status(201).json(info);
										}
									});
								}).catch( (err) => {
									console.log(err);
									response.status(err.code ? err.code : 500).json(err);
								});
							}
						});
					}
				});
			}
		});
	});
}

// route GET /picture/:name
exports.getPicture = function(request,response,next){
	let	dest = '';

	if(request.params.name[0] === 'e') dest += 'event/';
	else if (request.params.name[0] === 'c') dest += 'channel/';

	if(dest === ''){
		response.status(403).json({err:"invalid url"});
		return;
	} 

	// name[1] is size , we don't use size in managing directory
	dest += request.params.name.substr(2,mongoIDsize) + '/';
	dest += request.params.name.substr(2+mongoIDsize,request.params.name.length);
	 
	response.sendFile(path.join(picturePath,dest),function(err){
    if(err){
      var error = {};
      error.err = "error in sending file";
      console.error("error in sending file");
			console.error(err);
      response.status(500).json(error);
      // return next(err);
    }
    else{
			var picname = request.params.name;
      console.log("Sent : "+picname);
    }
  });
}

// route DELETE /picture/:name
exports.deletePictureHandle = function(request,response,next){

	let id = request.params.name.substr(1,mongoIDsize);
	let field = '';
	let size = '';
	let name = request.params.name.substr(2,request.params.name.length);
	
	let info = {};
	let PORT = config.PORT === 80 ? '' : ':'+config.PORT;
	
	//move picture to folder bin
	if(request.params.name[0] === 'e') field = 'event';
	else if (request.params.name[0] === 'c') field = 'channel';

	if(request.params.name[1] === 's') size = 'small';
	else if (request.params.name[1] === 'l') size = 'large';

	if(!id || !field || !name || !size){
		response.status(400).json({err:"invalid url"});
		return;
	}

	checkPermission(request,id,field, (info) => {
		if(info.err){
			response.status(403).json(info);
			return;
		}
		else deletePicture(id, field, size, name, (err) => {
			if(err) response.status(500).json(err);
			else{
				info.err = 'done';
				info.id = id;
				if(request.user){
					if(request.user.notification != undefined && request.user.notification != null){
						info.notification = request.user.notification;
					}
				}
				response.status(200).json(info);
			} 
		});
	});			
}

function deletePicture(id, field, size, name, callback){
	// model is USER / CHANNEL
	let oldpath = path.join(picturePath,field,id,name);
	let newpath = path.join(picturePath,'bin/',field,id,name);
	console.log(oldpath,newpath);

	findMODEL(id, field, (err,model) => {
		if(size=='small') model.picture=null;
		else {
			let index = model.picture_large.indexOf(config.URL+'/picture/'+name);
			if(index>-1) model.picture_large.splice(index,1);
		}
		model.update(model,function(err){
			if(err){
				callback({err:'error1',code:500});
				// return next(err);
			}
			else{
				mkdirp(path.join(picturePath,'bin',field,id),function(err){
					if(err){
						info.err = "error";
						info.code = 500;
						console.error("error mkdirp : deletePicture - picture.controllers");
						callback(info);
					}				
					else{
						if(fs.existsSync(oldpath)){
							fs.rename(oldpath,newpath,function(err){
								if(err){
									console.error(new Date(),"error: rename picture");
									console.error(err);
									callback({err:'error2',code:500});
									// return next(err);
								}
								else callback(null);
							});
						}
						else{
							console.error(new Date(),"error:picture for deleting not found");
							callback({err:'picture for deleting is not found',code:404});
						}
					}
				});
			}
		});
	});
}


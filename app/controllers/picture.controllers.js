let fs = require('fs');
let multer = require('multer');
let path = require('path');
let Event = require('mongoose').model('Event');
let Channel = require('mongoose').model('Channel');
let mkdirp = require('mkdirp');
let _ = require('lodash');
let config = require('../../config/config');
const {findMODEL, checkPermission} = require('../../config/utility');
const picturePath = path.join(__dirname,'../../','data/pictures/');
const mongoIDsize = 24;
const {maxAvatarSize, maxCoverPhotoSize, limitNumberPhotoupload} = config; 
const URLlen = `${config.URL}/picture/fs`.length;
//route POST /picture?size=...&field=... with req body
exports.postPicture= function(request,response,next){
	let id = request.query.id;
	let field = request.query.field;
	let size = request.query.size;
	let maxFileSize = size === "small" ? maxAvatarSize : maxCoverPhotoSize;
	let uploaded = [];
	let dest = `${field}/${id}`;
	let maxSize = size ==="large" ? limitNumberPhotoupload : 1;
	//path to save picture
	let storage = multer.diskStorage({
		destination: function(request,file,callback){
			callback(null,`${picturePath}${dest}`);
		},
		filename: function(request,file,callback){
			let name = (Math.random()+1).toString(36).substring(7)+Date.now()+path.extname(file.originalname).toLowerCase();
			uploaded.push(name);
			callback(null,name);
		}
	});

	//upload is first-class function
	let upload = multer({
		storage:storage,
		limits:{
			fileSize: maxFileSize
		}
	}).array('pictures',maxSize);

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

	new Promise( (resolve,reject) => {
		// check permission
		let {user, authentication_info} = request;
		checkPermission({user, authentication_info}, id, field, (info) => {
			console.log('post picture...',new Date());
			if(info.err){
				reject(info);
			}
			else{
				resolve();
			}
		});
	}).then( () => {
		// create dir
		return new Promise( (resolve,reject) => {
			mkdirp(`${picturePath}${dest}`,function(err){ // save picture on filesystem
				if(err){
					console.error("error mkdirp : postPicture - picture.controllers");
					reject({err:"internal error",code: 500});
				}
				else resolve();
			});
		});
	}).catch( (error) => {
		return Promise.reject(error);
	}).then( () => {
		// find model
		return new Promise( (resolve,reject) => {
			findMODEL(id,field, (err,model) => {
				if(err){
					console.error(new Date().toString());
					console.error(err);
					reject(err);
				}
				else resolve(model);
			});
		});
	}).catch( (error) => {
		return Promise.reject(error);
	}).then( model => {
		//upload to model folder
		console.log('uploading...');
		// upload picture
		return new Promise( (resolve,reject) => {
			upload(request,response,function(err){
				if(err){
					let info = err;
					info.err = "something went wrong";
					if(err.message === "File too large") info.err = `File is too large. The maximum size is ${maxFileSize/1000000}MB.`;
					console.error("error upload0 : postPicture - picture.controllers");
					console.error(err);
					info.code = 500;
					reject(info);
				}
				else {
					let urls = [];
					for(let i=0; i<uploaded.length; i++){
						urls.push(`${config.URL}/picture/${field[0]}${size[0]}${id}${uploaded[i]}`);
						if(urls.length === uploaded.length)
							resolve({model,urls});
					}
				}
			});
		});

	}).catch( (error) => {
		return Promise.reject(error);
	}).then( ({model, urls}) => {
		//save link to model
		console.log('updating...');
		return new Promise( (resolve,reject) => {
			if(size=='small'){
				
				if(!model.picture){
					model.picture = urls[0];
					resolve({model, urls});
				}
				else{
					deletePicture(id, null, size, field, (err) => {
						if(err) reject(err);
						else{
							model.picture = urls[0];
							resolve({model, urls});
						}
					});
				}
			}
			else if(size === 'large'){
				model.picture_large = [...model.picture_large, ...urls];
				resolve({model, urls});
			}
			else reject({err:"invalid size"});
		});
	}).catch( (error) =>{
		return Promise.reject(error);
	}).then( ({model, urls}) => {
		//update model
		console.log('saving...');
		model.save(function(err){
			if(err){
				info.err = "something went wrong";
				response.status(500).json(info);
				console.error("error update model : postPicture - picture.controllers");
				// return next(err);
			}
			else {
				let info = {msg:"done",urls};
				if(request.user){
					if(request.user.notification !== undefined && request.user.notification !== null){
						info.notification = request.user.notification;
					}
				}
				response.status(201).json(info);
			}
		});
	}).catch( (error) =>{
		code = error.code ? error.code : 500;
		response.status(code).json(error);
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
			let error = {};
			error.err = "error in sending file";
			console.error("error in sending file");
			console.error(err);
			response.status(500).json(error);
			// return next(err);
		}
		else{
			let picname = request.params.name;
			console.log("Sent : "+picname);
		}
	});
}

// route DELETE /picture/ with body urls
exports.deletePictureHandle = function(request,response,next){
	const urls = _.get(request,'body.urls',null);
	const { user, authentication_info } = request;
	if(!urls || urls.length === 0 ){
		response.status(200).json({msg:"done"});
	}

	let id = urls[0].substr(URLlen,mongoIDsize);
	let field = '';
	let size = '';

	if(urls[0][URLlen-2] === 'e') field = 'event';
	else if (urls[0][URLlen-2] === 'c') field = 'channel';

	if(urls[0][URLlen-1] === 's') size = 'small';
	else if (urls[0][URLlen-1] === 'l') size = 'large';

	checkPermission({user, authentication_info}, id, field, (info) => {
		if(info.err){
			let code = info.code ? info.code:500;
			let err = info ? info:{err:"internal error"};
			response.status(code).json(err);
			return;
		}
		else{
			let allowedDelete = [];
			urls.forEach( (url) => {
				let name = url.substr(URLlen+mongoIDsize,url.length);
				allowedDelete.push({name,url})	
			});
			deletePicture(id, allowedDelete, size, field, (err) => {
				if(err) response.status(500).json({err:err});
				else response.status(200).json({msg:"done"});
			});
		}
	});
}

function deletePicture(id, deleteList, size, field, callback){
	console.log('delete pictures');
	// model is EVENT / CHANNEL
	findMODEL(id, field, (err,model) => {
		if(size === "small"){
			model.update({picture:null}, (err) => {
				if(err) callback({err:'Something went wrong'});
				else callback(null);
			});
			
		}
			
		else {
			new Promise( (resolve,reject) =>{
				let deleted = [];
				// remove picture from model
				deleteList.forEach( (pic) => {
					if(!pic.err){
						console.log(pic.url);
						const index = model.picture_large.indexOf(pic.url);
						if(index>-1){
							model.picture_large.splice(index,1);
							deleted.push(pic);
						}
					}
				});
				resolve(deleted);
			}).then( (deleted) => {
				// update model
				return new Promise( (resolve,reject) =>{
					model.update(model,function(err){
					if(err){
						reject({err:'error1',code:500});
					}
					else{
						resolve(deleted);
					}
					});
				});
			}).catch( error => {
				return Promise.reject(error);
			}).then( (deleted) => {
				// move to bin dir
				return new Promise( (resolve,reject) => {
					mkdirp(path.join(picturePath,'bin',field,id),function(err){
						if(err){
							info.err = "error";
							info.code = 500;
							console.error("error mkdirp : deletePicture - picture.controllers");
							reject(info);
						}
						else{
							for(let i=0;i<deleted.length;i++){
								let pic = deleted[i];
								let oldpath = path.join(picturePath,field,id,pic.name);
								let newpath = path.join(picturePath,'bin/',field,id,pic.name);
								if(fs.existsSync(oldpath)){
									fs.rename(oldpath,newpath,function(err){
										if(err){
											console.error(new Date(),"error: rename picture");
											console.error(err);
										}
										
									});
								}
								if(i===deleted.length-1) resolve();
							}
							if(deleted.length===0) resolve();
						}
					});
				});
			}).catch( (error) => {
				return Promise.reject(error);
			}).then( () =>{
				callback(null);
			}).catch( (error) => {
				callback(error);
			});
		}
	});
}

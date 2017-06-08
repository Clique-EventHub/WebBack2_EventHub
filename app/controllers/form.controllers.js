var Event = require('mongoose').model('Event'); // collections
var Form = require('mongoose').model('Form');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var moment = require('moment-timezone');


exports.listall = function(request,response){
	Form.find({}, (err,forms) =>{
		if(err) response.json(err);
		else response.json(forms);
	});
}

function checkPermission (request, channel, callback) {
	let user = request.user;
	//console.log('user',user);
	if(user){

		if(user.admin_channels.indexOf(channel) == -1){
			callback ({err:"No permission","code":403});
		}
		else callback({msg:'OK'});
	}
	else{
		console.log('no user');
		if(Object.keys(request.authen).length == 0 )
			callback({err:"Please login", code:403});
		else
			callback({err:request.authen, code:403});
	}
}

function findForm(id,callback){
		Form.findById(id,function(err,returnedForm){
			if(err){
				console.error({"err":"finding form error","code":500});
				callback ({"err":"fining form error",code:500});
				//return ({"err":"fining form error","code":500});
			}
			else if(!returnedForm){
				console.error({"err":"form not found","code":400});
				callback ({"err":"form not found",code:400});
				//return ({"err":"form not found","code":400});
			}
			else{
				console.log("form found");
				callback (returnedForm);	
			}
		});
}

// get form
// GET /form?id=[..]&opt=[answers,export]
exports.getForm = function (request,response){

	let process = new Promise((resolve,reject) => {
		resolve();
	});

	process.then( () => { 
		// findForm
		console.log('find form');
		return new Promise( (resolve,reject) => {
			findForm(request.query.id, function(returnedForm){
				if(!returnedForm || returnedForm.err) {
					reject(returnedForm);	
				}
				else resolve(returnedForm);
			});
		});

	}).then( (returnedForm) => {
		// check permission
		console.log('check permission');
		if(!returnedForm) {
			console.error('err', returnedForm);
			return Promise.reject({err:"form not found",code:404});
		}
		else if(request.query.opt === 'answers' || request.query.opt === 'export'){
			return new Promise( (resolve,reject) => {
				checkPermission(request, returnedForm.channel, function(data){
					if(data.err !== undefined) return reject(data);
					data.form = returnedForm;
					return resolve(data);
				});
			});
			
		}
		else if(Object.keys(request.query).length == 1 && request.query.id){
			returnedForm.answers = undefined;	
			console.log('return no answers', returnedForm);
			return Promise.resolve({msg:"OK",form:returnedForm});
		}
		else
			return Promise.reject({err:"invalid option",code:400});

	}).catch( (err) => {
		console.error('catch1',err);
		return Promise.reject(err);
	}).then( (info) => {
		// response
		console.log('prepare data');
		if(!info || info.err !== undefined) return Promise.resolve({err:'internal error',code:500});
		else {
			info.code=200;
			return Promise.resolve(info);	
		}
	}).catch( (err) => {
		console.error('catch2',err);
		code = !err && err.code ? err.code : 500;
		err = err ? err : {err:'internal error'};
		return Promise.resolve(err);	
	}).then( (info) => response.status(info.code).json(info) );

}





// edit form
// PUT /form
exports.createForm = function(request, response){
	let process = new Promise((resolve) => {
		resolve();
	});	

	process.then( () => {
		if(request.body.channel === undefined) {
			console.error("channel is undefined");
			return Promise.reject({err:"Please Provide channel",code:400});	
		}
		else return Promise.resolve(checkPermission(request, request.user, request.body.channel));
	}).then( (info) => {
		if(info.msg === "OK"){
			return Promise.resolve(new Form(request.body).save());	
		}
		else return Promise.reject(info);
	}).then( (newForm) => {
		if(newForm.err !== undefined) return Promise.reject(newForm);
		else response.status(201).json({msg:'done'});
	}).catch( (info) => {
		console.error(info);
		response.status(info.code).json(info);
	});
}


// response form
exports.responseForm = function(request, response){

}


// export form
exports.exportForm = function(request,response){

}

// delete form
exports.deleteForm = function(request,response){

}

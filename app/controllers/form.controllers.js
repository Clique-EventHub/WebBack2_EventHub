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
				console.error({"err":"fining form error","code":500});
				callback ({"err":"fining form error","code":500});
				//return ({"err":"fining form error","code":500});
			}
			else if(!returnedForm){
				console.error({"err":"form not found","code":400});
				callback ({"err":"form not found","code":400});
				//return ({"err":"form not found","code":400});
			}
			else{
				console.log("form found");
				callback (null,returnedForm);	
				//return (returnedForm);	
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
		return new Promise( (resolve,reject) => {
			findForm(request.query.id, function(err,returnedForm){
				//		console.log('returnedForm:',returnedForm);
				if(returnedForm === undefined) reject(returnedForm);	
				else return resolve(returnedForm);
			});
		});

	}).then( (returnedForm) => {
		// check permission
		if(!returnedForm) {
			console.error('err', returnedForm);
			return Promise.reject({err:"form not found"});
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

	}).then( (info) => {
		// response
		if(!info || info.err !== undefined) return Promise.reject(info);
		else response.status(200).json(info);	
		console.log('success',info);
	}).catch( (info) => {
		response.status(info.code ? info.code : 500).json(info);
		console.error(info);	
	});

}





// edit form
// PUT /form
exports.createForm = function(request, response){
	let process = new Promise((resolve,reject) => {
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

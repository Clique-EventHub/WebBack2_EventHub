var Event = require('mongoose').model('Event'); // collections
var Form = require('mongoose').model('Form');
var Admin = require('./admin.controllers');

var path = require('path');
var mkdirp = require('mkdirp');
var moment = require('moment-timezone');

var bluebird = require("bluebird");
var jsonexport = require('jsonexport');
var fs = require('fs');

exports.listall = function(request,response){
	Form.find({}, (err,forms) =>{
		if(err) response.json(err);
		else response.json(forms);
	});
}
//
// export form
function exportForm (data,callback){
	const fileName = data.title;
	//const url = `api.cueventhub.com/download/form/${fileName}.csv`;
	//const url = fileName+'.csv';	
	console.log('data responses',data.responses);	
	bluebird.map(data.responses, element => {
		let temp = {};
		temp["_firstName"] = element.firstName;
		temp["_lastName"] = element.lastName;

		for(let attName in element.answers)
			temp[attName] = element.answers[attName];

		return temp;
		
	}).then( pass => {
		return new Promise( (resolve,reject) => {
			jsonexport(pass,function(err, csv){
				if(err)	reject(err); 
				else resolve(csv);	
			});	
		});
	}).then( file => {
		fs.writeFile(url, file, function(err){
			if(err){
				callback(err);
				console.error(err);
			}	
			else{
				console.log('done');
				callback(null,url);
			}
		});	
	}).catch( (err) => {
		console.error(err);
		callback(err);
	});
	
}


function checkPermission (request, event, callback) {
	let user = request.user;
	//console.log('user',user);
	if(user){

		if(user.admin_events.indexOf(event) === -1){
			console.error('no permission');
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
			else if(!returnedForm || returnedForm.tokenDelete){
				console.error({"err":"form not found","code":404});
				callback ({"err":"form not found",code:404});
				//return ({"err":"form not found","code":400});
			}
			else{
				console.log("form found");
				callback (returnedForm);	
			}
		});
}

// get form
// GET /form?id=[..]&opt=[responses,export]
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
		else if(request.query.opt === 'responses' || request.query.opt === 'export'){
			return new Promise( (resolve,reject) => {
				checkPermission(request, returnedForm.channel, function(data){
					if(data.err !== undefined) return reject(data);
					data.form = returnedForm;
					if(request.query.opt === 'export'){
						exportForm(returnedForm, (err, url) => {
							if(err) return reject({err:err});
							else return resolve({msg:"OK",url:url});
						});	
					}
					else return resolve(data);
				});
			});
			
		}
		else if(Object.keys(request.query).length == 1 && request.query.id){
			returnedForm.responses = undefined;	
			console.log('return no responses', returnedForm);
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
// POST /form?id=
exports.createForm = function(request, response){
	let process = new Promise((resolve) => {
		resolve();
	});	
	let form_id = request.query.id;
	process.then( () => {
		if(request.body.event === undefined || request.body.channel === undefined) {
			console.error("channel or event is undefined");
			return Promise.reject({err:"channel or event is not provided",code:400});	
		}

		else return new Promise( (resolve,reject) => {
			checkPermission(request, request.body.event, 
			(data) => {
				if(data.err) reject(data);
				else resolve(data);
			})
		});
	}).then( (info) => {
		if(info.msg === "OK"){
			if(form_id !== undefined){
				return new Promise( (resolve,reject) => {
					Form.findByIdAndUpdate(form_id,request.body, (err,result) => {
						if(err){
							console.error('create form:find form error', request);
							reject({err:"Internal error",code:500});
						}
						else if(!result){
							console.error("form not found");
							reject({err:"Form not found",code:404});
						}
						else{
							console.log("Edit form success");
							resolve(result);
						}
					});
				});
			}
			else return Promise.resolve(new Form(request.body).save());	
		}
		else return Promise.reject(info);
	}).then( (newForm) => {
		if(newForm.err !== undefined) response.status(500).json({err:"Internal error"}); 
		else{
			Event.findByIdAndUpdate(request.body.event,{
				$push : {forms: newForm._id}
			}, (err) => {
				if(err){
					response.status(500).json({msg:"Internal error"});
					console.error("update form to event error");
				}
				if(form_id !== undefined) status = 200;
				else status = 201;
				response.status(status).json({msg:'done',id:newForm._id});
			});	
		}
	}).catch( (info) => {
		console.error(info);
		response.status(info.code ? info.code : 500).json(info ? info : {err:"Internal error"});
	});
}


// response form
// PUT /form?id=[form's id]
// body is answers 
exports.responseForm = function(request, response){

	if(request.user){
		let data = {};
		data.answers = request.body;
		data.firstName = request.user.firstName;
		data.lastName = request.user.lastName;
		data.user_id = request.user._id;
		data._id = undefined;

		Form.findByIdAndUpdate(request.query.id,{
			$push : {responses: data}		
		}, (err,returnedForm) => {
			if(err){
				console.error('response form error:', request);
				response.status(500).json({err:'Internal error'});
			}
			else if(!returnedForm){
				console.error('response form : form not found', request);
				response.status(404).json({err:'Form not found'});
			}
			else{
				console.log('response form success');
				console.log(returnedForm);
				response.status(200).json({msg:"done"});
			}
		});			
	}

	else{
		response.status(403).json({err:'Please login'});
	}
	
}


// delete form
exports.deleteForm = function(request,response){
	Form.findByIdAndUpdate(request.query.id,{
		tokenDelete : true
	}, (err,returnedForm) => {
		if(err){
			console.error('response form error:', request);
			response.status(500).json({err:'Internal error'});
		}
		else if(!returnedForm){
			console.error('response form : form not found', request);
			response.status(404).json({err:'Form not found'});
		}
		else{
			checkPermission(request,returnedForm.event, (res) => {
				if(res.err){
					response.status(res.code).json({res});
				}
				else{
					console.log('response form success');
					console.log(returnedForm);
					response.status(200).json({msg:"done"});
				}
			});
		}
	});	
}

exports.clearForm = function(request,response){
	Form.findByIdAndRemove(request.query.id, () => response.send('done'));
}

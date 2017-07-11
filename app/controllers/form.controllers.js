var Event = require('mongoose').model('Event'); // collections
var Form = require('mongoose').model('Form');
var Admin = require('./admin.controllers');
var path = require('path');
var mkdirp = require('mkdirp');
var moment = require('moment-timezone');
var bluebird = require("bluebird");
var jsonexport = require('jsonexport');
var fs = require('fs');
var postFieldForm = require('../../config/utility').postFieldForm;
var _ = require('lodash');

const filePath = path.join(__dirname,'../..',`data/exportCSV/`);

exports.listall = function(request,response){
	Form.find({}, (err,forms) =>{
		if(err) response.json(err);
		else response.json(forms);
	});
}
//
// export form
function exportForm (data,callback){
	const fileName = `${data.title}-${data.event}.csv`;

	//const url = `api.cueventhub.com/download/form/${fileName}.csv`;
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
	}).catch( (err) => {
		return Promise.reject(err);
	}).then( file => {
		return new Promise( (resolve,reject) => {
			mkdirp(filePath, function (err) {
				if (err) reject(err);
				else resolve(file);
			});
		});
	}).catch( (err) => {
		return Promise.reject(err);
	}).then( file => {
		fs.writeFile(`${filePath}${fileName}`, file, function(err){
			if(err){
				callback(err);
				console.error(err);
			}
			else{
				console.log('done');
				callback(null,`${filePath}${fileName}`);
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
		if(request.authentication_info.message === "No auth token")
			callback({err:"Please login", code:403});
		else
			callback({err:request.authentication_info.message, code:403});
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
				checkPermission(request, returnedForm.event, function(data){
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
	}).then( (info) => {
		if(!info.err && request.query.opt==='export') response.status(200).sendFile(info.url);
		else	response.status(info.code).json(info);
	});


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
			let obj = {};
			for(let i=0;i<postFieldForm.length;i++){
					obj[postFieldForm[i]] = _.get(request.body, postFieldForm[i], undefined);
				}

			if(form_id !== undefined){
				return new Promise( (resolve,reject) => {
					Form.findByIdAndUpdate(form_id, obj, (err,result) => {
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
			else{
				var newForm = new Form(obj);
				console.log("saving new form");
				return new Promise( (resolve,reject) => {
					newForm.save( (err,form) => {
						if(err) {
							console.error(err);
							return reject({err:"internal error"});
						}
						console.log("saving", form);
						return resolve(form);
					});
				});
			}
		}
		else return Promise.reject(info);
	}).then( (newForm) => {
		if(newForm.err !== undefined) response.status(500).json({err:"Internal error"});
		else{
			let obj = {};
			obj[newForm.title] = newForm._id;
			console.log('create form',obj);
			Event.findByIdAndUpdate(request.body.event,{
				$push : {forms: obj }
				}, (err, returnedForm) => {
				if(err){
					response.status(500).json({msg:"Internal error"});
					console.error("update form to event error");
					return;
				}
				if(form_id !== undefined) status = 200;
				else status = 201;
				let returnedData = {};
				for(let i=0; i < postFieldForm.length; i++){
					returnedData[postFieldForm[i]] = _.get(returnedForm,postFieldFormi,undefined);
				}
				response.status(status).json({msg:'done',id:newForm._id,form:returnedData});
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
	if(!request.query.id) response.status(403).json({err:"Please provide form's id"});

	if(request.user){
		let data = {};
		data.answers = request.body;
		data.firstName = request.user.firstName;
		data.lastName = request.user.lastName;
		data.user_id = request.user._id;
		data._id = undefined;

		new Promise( (resolve,reject) => {
			Form.findById(request.query.id,(err,returnedForm) => {
				if(err){
					console.error('response form error:', request);
					reject({code:500,err:'Internal error'});
				}
				else if(!returnedForm){
					console.error('response form : form not found', request);
					reject({code:404,err:'Form not found'});
				}
				else{
					if(returnedForm.responses === null){
						returnedForm.responses = [];
					}
					returnedForm.responses.push(data);
					resolve(returnedForm);
				}
			});
		}).then( returnedForm => {
			returnedForm.save( (err,form) => {
				if(err){
					console.error('save response form error:', request);
					responses.status(500).json({err:"Internal Server Error"});
				}
				else{
					let data = {};
					let pos = _.get(form,"responses.length",0)-1;
					data = _.get(form,['responses',pos], undefined);
					response.status(200).json({id:form._id,response:data});
				}
			});
		}).catch( info => {
			let code = info.code ? info.code : 500;
			let err = info.err ? info.err : "Internal error";
			response.status(code).json(err);
		});



	}

	else{
		response.status(403).json({err:'Please login'});
	}

}


// DELETE /form&id=
// body 
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

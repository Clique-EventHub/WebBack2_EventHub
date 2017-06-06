var Event = require('mongoose').model('Event'); // collections
var Form = require('mongoose').model('Form');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var moment = require('moment-timezone');




function checkPermission (user,channel) {
	if(user){
		if(user.admin_channels.indexOf(channel) == -1){
			return ({err:"No permission for create event","code":403});
		}
		else return({msg:'OK'});
	}
	else{
		if(Object.keys(request.authen).length == 0 )
			return({err:"Please login", code:403});
		else
			return({err:request.authen, code:403});
	}
}

function findForm(id){
		Form.findById(id,function(err,returnedForm){
			if(err){
				return ({"err":"fining form error","code":500});
			}
			else if(!returnedForm){
				return ({"err":"form not found","code":400});
			}
			else{
				return (returnedForm);	
			}
		});
}

// get form
// ../form?id=[..]&opt=[answers,export]
exports.getForm = function (request,response){
	let channel;
	let process = new Promise((resolve,reject) => {
		resolve();
	});

	// chcek permission

	process.then( () => { 

		returnedForm = findForm(request.query.id);
		if(this.returnedForm !== undefined) return Promise.reject(returnedForm);	
		else return Promise.resolve(returnedForm);

	}).then( (returnedForm) => {

		if(request.query.opt === 'answers' || request.query.opt === 'export')
			return Promise.resolve(checkPermission(request.query.id,returnedForm.id));
		else if(Object.keys(request.query).length == 1 && request.query.id) 
			return Promise.resolve({msg:"OK"});
		else
			return Promise.reject({err:"invalid option",code:400});

	}).then( (info) => {
		if(info.err !== undefined) return Promise.reject(info);
		else response.status(200).json(info);	
	}).catch( (info) => response.status(info.code).json(info));


}





// edit form
exports.createForm = function(request, response){

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

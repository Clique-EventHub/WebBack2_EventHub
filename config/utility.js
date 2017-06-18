let Event = require('mongoose').model('Event');
let Channel = require('mongoose').model('Channel');
let User = require('mongoose').model('User');
let Form = require('mongoose').model('Form');

exports.checkPermission = function (request, id, opt, callback) {
	let user = request.user;
	console.log(new Date(),'checking permission ',id,opt);
	console.log(request);
	if(user){
		if(opt === "event"){
			if(user.admin_events.indexOf(id) === -1){
				console.error('no permission');
				callback ({err:"No permission","code":403});
			}
			else callback({msg:'OK'});
		}
		else if(opt === "channel"){
			if(user.admin_channels.indexOf(id) === -1){
				console.error('no permission');
				callback ({err:"No permission","code":403});
			}
			else callback({msg:'OK'});
		}
	}
	else{
		console.log('no user');
		if(Object.keys(request.authen).length === 0 )
			callback({err:"Please login", code:403});
		else
			callback({err:request.authen, code:403});
	}
}

exports.findMODEL = function(id,opt,callback){
	// callback (error,model);
	console.log("findMODEL...",id,opt);
	console.log(new Date());
	if(opt === "event"){
		Event.findById(id,function(err,event){
			if(err){
				callback({code:500,err:'find event error'});
				console.error(err);
			}
			else if(!event) {
				console.error(new Date(),{
					err : "event not found",
					func : "utility - findMODEL"	
				});
				callback({code:404,err:'event not found'});
			}
			else{
				callback(null,event);
			}
		});
	}
	else if(opt === "channel"){
		Channel.findById(id,function(err,channel){
			if(err){
				callback({code:500,err:'find channel error'});
				console.error(err);
			}
			else if(!channel) {
				console.error(new Date(),{
					err : "channel not found",
					func : "utility - findMODEL"	
				});
				callback({code:404,err:'channel not found'});
			}
			else{
				callback(null,channel);
			}
		});
	}
	else if(opt === "form"){
		Form.findById(id,function(err,form){
			if(err){
				callback({code:500,err:'find form error'});
				console.error(err);
			}
			else if(!form) {
				console.error(new Date(),{
					err : "form not found",
					func : "utility - findMODEL"	
				});
				callback({code:404,err:'form not found'});
			}
			else{
				callback(null,form);
			}
		});
	}
	else if(opt === "user"){
		User.findById(id,function(err,user){
			if(err){
				callback({code:500,err:'find user error'});
				console.error(err);
			}
			else if(!user) {
				console.error(new Date(),{
					err : "user not found",
					func : "utility - findMODEL"	
				});
				callback({code:404,err:'user not found'});
			}
			else{
				callback(null,form);
			}
		});
	}
	else callback({err:'invalid model'});
}
const Event = require('mongoose').model('Event'); // collections
const Channel = require('mongoose').model('Channel');
const User = require('mongoose').model('User');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment-timezone');
const config = require('../../config/config');
const utility = require('../../config/utility');
const { storagePath, modify_log_size } = config;
const { getableStatEvent, getableFieldEvent, editableFieldEvent } = utility;
const _ = require('lodash');
//route /
exports.hi = function(request,response,next){
	response.send("hello dude");
}

//route /listall
exports.listAll = function(request,response,next){
	Event.find({},function(err,events){
		if(err) response.status(500).json({err:"internal error"});
		else{
			var info = events;
			if(request.user){
				if(request.user.notification != undefined && request.user.notification != null){
					info.notification = request.user.notification;
					response.status(200).json(info);
				}
				else{
					response.status(200).json(info);
				}
			}
			else{
				response.status(200).json(info);
			}
		}
	});
};


// query data of event
var queryGetEvent = function(event, isStat, info){
	return new Promise(function(resolve, reject){
		let promises = [];
		let fields = getableFieldEvent;
		if(isStat) fields = [...fields, ...getableStatEvent];
		console.log(getableFieldEvent);
		console.log(fields);
		for(var i=0; i<fields.length; i++){
			if(event[fields[i]] || fields[i]=='expire'){
				if((fields[i]==='year_require'||fields[i]==='faculty_require')){
					if(event[fields[i]].length>0){
						info[fields[i]] = event[fields[i]];
					}
				}
				else if(fields[i] == 'channel'){
					promises[promises.length] = new Promise(function(resolve, reject){
						findChannelForEvent(event[fields[i]]).catch(function(err){
							//	info.err = msg;     // not sure
							reject(err);
						}).then(function(channelInfo){
							info.channel = event['channel'];
							info.channel_name = channelInfo['name'];
							info.channel_picture = channelInfo['picture'];
							resolve();
						});
					});
				}
				else{
					info[fields[i]] = event[fields[i]];
				}
			}
		}
		Promise.all(promises).then(function(){
			resolve(info);
		});
	});
};

//route GET /event?id=...&stat=bool
exports.getEvent = function(request,response,next){
	var id = request.query.id;
	var info = {};
	Event.findById(id,function(err,event){
		if(err){
			info.err = 'finding event error';
			console.error("\x1b[31m",new moment().tz("Asia/Bangkok").toString())
			console.error("\x1b[37m",err);
			response.status(500).json(info);
			// return next(err);
		}
		else if(!event){
			info.err = "event not found";
			console.error("\x1b[31m",new moment().tz("Asia/Bangkok").toString())
			console.error("\x1b[37m","event not found",request);
			response.status(400).json(info);
		}
		else{
			var isStat = false;
			if(request.query.stat === "true") isStat = true;
			queryGetEvent(event, isStat, info)
			.catch(function(err){
				console.error(new Date().toString());
				console.error("queryGetEvent error");
				response.status(500).json({err:err});
				// return next(err);
			}).then(function(returnedInfo){
				putStat(id, function(info){
					if(info.code != 201){
						response.status(info.code).json(info.msg);
						console.error(new Date().toString());
						console.error("putstat error");
					}
					else{
						if(request.user && request.user.notification != undefined && request.user.notification != null){
							returnedInfo.notification = request.user.notification;
							response.status(200).json(returnedInfo);
						}
						else{
							response.status(200).json(returnedInfo);
						}
					}
				});

			});
		}
	});
}

//route POST /event with req body
exports.postEvent = function(request,response,next){

	var channel = request.body.channel;
	var title = request.body.title;
	// validate input data
	if(!channel || !title ){
			response.status(400).json({err:"invalid title or channel"});
			return;
	}

	// chcek permission
	if(request.user){
		if(request.user.admin_channels.indexOf(channel) == -1){
			response.status(403).json({err:"No permission for create event"});
			return;
		}
	}
	else{
		if(request.authentication_info.message === "No auth token")
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authentication_info.message});
		return;
	}

	// if permission and validate ok
	var keys = Object.keys(request.body);
	var fields = ['title', 'channel', ...editableFieldEvent];

	for(let i=0;i<keys.length;i++){
		if(fields.indexOf(keys[i]) == -1){
			delete request.body[keys[i]];
		}
	}
	var date = new moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
	var newEvent = new Event(request.body);
	var info = {};
	newEvent.visit_per_day.push({});	// keep stat visit per day as object
	newEvent.visit_per_day[0][date]=0;	// set defuat of created day as 0
	newEvent.Creator = request.user._id;
	newEvent.lastModified.push({when:newEvent.created_date,who:request.user._id});
	newEvent.save(function(err){		// save new event
		if(err){
			if(err.code === 11000)
				response.status(400).json({err : "duplicate title"});
			else{
				console.error(err);
				response.status(500).json({err : "internal error"});
				// return next(err);
			}
		}
		else{
			var channelId = newEvent.channel;
			var condition = {$push:{}};				// condition for update channel
			condition.$push.events = newEvent._id;	// push newEvent id to channel events field
			Channel.findByIdAndUpdate(channelId,condition,function(err,channel){
				if(err){
					info.err = "internal error";
					console.error("error1 : postEvent - event.controllers");
					response.status(500).json(info);
					// return next(err);
				}
				else if(!channel){
					info.err = "channel not found";
					console.error("channel not found : postEvent - event.controllers");
					response.status(404).json(info);
				}
				else{
					notiPostEvent(newEvent._id, channel.name, channel.picture, channel.who_subscribe, newEvent.tags, newEvent.picture)
					.catch(function(info){
							response.status(info.code).json(info.msg);
					})
					.then(function(info){
						console.log("post new Event");
						info.id = newEvent._id;
						if(request.user && request.user.notification != undefined && request.user.notification != null){
							info.notification = request.user.notification;
							response.status(201).json(info);
						}
						else{
							response.status(201).json(info);
						}
					});
				}
			});
		}
	});
}

// route PUT /event?id=... with req body
exports.putEvent = function(request,response,next){

	// validate input
	if(request.query.id === undefined){
		response.status(400).json({err:"event id is invalid"});
		return;
	}
	var keys = Object.keys(request.body);
	var editableFields = editableFieldEvent;
	var detail = [];
	for(var i=0;i<keys.length;i++){
		if(editableFields.indexOf(keys[i]) == -1){
			delete request.body[keys[i]];
		}
		else{
			detail.push(keys[i]);
		}
	}
	check_permission(request,function(code,err,event){
		if(code !== 200){
			response.status(code).json(err);
		}
		else{
			request.body.lastModified = event.lastModified;
			request.body.lastModified.push({when:new moment(),who:request.user._id});
			if(request.body.lastModified.length >= modify_log_size)
				request.body.lastModified.splice(0,request.body.lastModified-modify_log_size);
			event.update({
				$set:request.body
			},function(err){
				if(err){
					console.error(err);
					response.status(500).json({err:"internal error."});
				}
				else{
					var info = {"msg":"done."};
					if(request.user){
						if(request.user.notification != undefined && request.user.notification != null){
							info.notification = request.user.notification;
							response.status(201).json(info);
							notiPutEvent(event._id, event.who_join, event.who_interest, event.title, event.picture, detail);
						}
						else{
							response.status(201).json(info);
							notiPutEvent(event._id, event.who_join, event.who_interest, event.title, event.picture, detail);
						}
					}
					else{
						response.status(201).json(info);
						notiPutEvent(event._id, event.who_join, event.who_interest, event.title, event.picture, detail);
					}
				}
			});
		}
	});
}

// route DELETE /event?id=...
// call from deleteEvent
var updateDeleteEventToChannel = function(channelId,eventId,response){
	var info = {msg:"done"};
	Channel.findById(channelId,function(err,channel){
		if(err){
			info.err = 'error1';
			console.error("error1 : updateDeleteEventToChannel - event.controllers");
			response.status(500).json(info);
			// return next(err);
		}
		else if(!channel){
			info.err = "channel not found";
			console.error("error2 : updateDeleteEventToChannel - event.controllers");
			response.status(404).json(info);
		}
		else{	// move deleted event to bin array
			channel.events_bin.push(eventId);
			channel.events.splice(channel.events.indexOf(eventId),1);
			channel.update(channel,function(err){
				if(err){
					info.err = "error3";
					response.status(500).json(msg);
					console.error("error3 : updateDeleteEventToChannel - event.controllers");
					// return next(err);
				}
				else {
					notiDeleteEvent(eventId, function(info){
						if(info.code == 201){
							if(request.user){
								if(request.user.notification != undefined && request.user.notification != null){
									info.notification = request.user.notification;
									response.status(201).json({msg:info.msg});
								}
								else{
									response.status(201).json({msg:info.msg});
								}
							}
							else{
								response.status(201).json({msg:info.msg});
							}
						}
						else{
							response.status(500).json({msg:info.msg});
						}
					});
				}
			});
		}
	});
};

//route DELETE /event?id=...
exports.deleteEvent = function(request,response,next){
	var id = request.query.id;
	var info = {msg:"done"};

	check_permission(request,function(code,err,event){
		if(code!==200)
			response.status(code).json(err);
		else{
			request.body.lastModified = event.lastModified;
			request.body.lastModified.push({when:new moment(),who:request.user._id});
			if(request.body.lastModified.length >= modify_log_size)
				request.body.lastModified.splice(0,request.body.lastModified-modify_log_size);
			event.update({
				$set:request.body,
				tokenDelete:true
			},function(err){
					if(err){
						console.error(err);
						response.status(500).json({err:"internal error"});
					}
					else{
						updateDeleteEventToChannel(event.channel,event._id,response);
					}
				});
		}
	});
}

//route GET /event/stat?id=...
exports.getStat = function(request,response,next){

	var info = {};

	check_permission(request,function(code,err,event){
		if(code!=200) response.status(code).json(err);
		else{
			var fields = getableStatEvent;
			for(var i=0;i<fields.length;i++){
				info[fields[i]]=event[fields[i]];
			}
			if(request.user){
				if(request.user.notification != undefined && request.user.notification != null){
					info.notification = request.user.notification;
					response.status(200).json(info);
				}
				else{
					response.status(200).json(info);
				}
			}
			else{
				response.status(200).json(info);
			}
		}
	});
};

exports.sendMessageToJoin = function(request, response){
	check_permission(request, function(code,err,event){
		if(code!=200) response.status(code).json(err);
		else{
			Event.findById(request.query.id, function(err, event){
				if(err){
					response.status(500).json({msg:"internal error."});
				}
				else if(!event){
					response.status(404).json({msg:"event not found."});
				}
				else{
					notiInfoForJoinPeople(request.query.id, event.who_join, request.body.description, event.picture, event.title)
					.then(function(info){
						response.status(info.code).json({msg:info.msg});
					});
				}
			});
		}
	});
};

exports.personalNotification = function(request, response){
	check_permission(request, function(code, err, event){
		if(code!=200) response.status(code).json(err);
		else{
			Event.findById(request.query.id, function(err, event){
				if(err){
					response.status(500).json({msg:"internal error."});
				}
				else if(!event){
					response.status(404).json({msg:"event not found."});
				}
				else{
					let people = [];
					for(let i=0;i<request.body.people.length;i++){
						if(event.who_join.indexOf(request.body.people[i]) != -1 || event.who_interest.indexOf(request.body.people[i]) != -1){
							people.push(request.body.people[i]);
						}
					}
					notiInfoForJoinPeople(request.query.id, people, request.body.description, event.picture, event.title)
					.then(function(info){
						response.status(info.code).json({msg:info.msg});
					});
				}
			});
		}
	});
};


// increase stat when getEvent
var putStat = function(id,callback){
	//var d = new time.Date().setTimezone('Asia/Bangkok');
	//var date = d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear();
	var date = new moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
	Event.findById(id,function(err,event){
		if(err){
			console.error("error find event : putStat - event.controllers");
			var info = {};
			info.msg = "internal error in putStat";
			info.code =  500;
			callback(info);
			// return next(err);
		}
		else if(!event){
			var info = {};
			info.msg = "event not found";
			info.code = 404;
			console.error("event not found");
			callback(info);
		}
		else{
		//	event.lastModified = moment().format();
			event.visit+=1;								//add visit
			if(event.visit_per_day.length==0){			//add object to empty array
				event.visit_per_day.push({});
				event.visit_per_day[0][date]=1;
			}
			// add date for the first visit for the day
			else if(!event.visit_per_day[event.visit_per_day.length-1].hasOwnProperty(date)){
				event.visit_per_day.push({});
				event.visit_per_day[event.visit_per_day.length-1][date]=1;
			}
			// add visit_per_day
			else event.visit_per_day[event.visit_per_day.length-1][date]+=1;

			event.update(event,function(err){
				if(err){
					console.error("error1 update event : putStat - event.controllers");
					var info={};
					info.msg = "internal error in putStat";
					info.code = 500;
					callback(info);
					// return next(err);
				}
				else{
					console.log("push stat done");
					var info = {};
					info.msg = "done";
					info.code = 201;
					callback(info);
				}
			});
		}
	});
};

//==============================notification==============================

var notiPostEvent = function(eventId, channel_name, channel_picture, who_subscribe, tags, eventPicture){
	return new Promise(function(resolve, reject){
		var promises = [];
		var errorList = [];
		for(let i=0;i<who_subscribe.length;i++){
			promises.push(new Promise(function(resolve, reject){
				let index = i;
				var noti = {};
				noti.title = channel_name+" added a new event.";
				noti.link = 'https://www.cueventhub.com/event?id='+eventId+'&stat=true';
				noti.photo = channel_picture;
				noti.source = channel_name;
				noti.seen = false;
				var d = new Date();
				noti.timestamp = d.getTime();
				User.findByIdAndUpdate(who_subscribe[index], {
					$addToSet : {notification : noti}
				}, function(err, user){
					if(err || !user){
						errorList.push(who_subscribe[index]);
					}
					resolve();
				});
			}));
		}
		promises.push(new Promise(function(resolve, reject){
			let promises2 = [];
			User.find({tag_like : { $in : tags}}, function(users){
				for(let i=0;users != null && i<users.length;i++){
					if(who_subscribe.indexOf(users[i]._id) == -1){
						promises2.push(new Promise(function(resolve, reject){
							let index = i;
							var noti2 = {};
							noti2.title = "New event in tags you're interested in.";
							noti2.link = 'https://www.cueventhub.com/event?id='+eventId+'&stat=true';
							noti2.photo = eventPicture;
							noti2.source = users[index].tag_like;
							noti2.seen = false;
							var date = new Date();
							noti2.timestamp = date.getTime();
							User.findByIdAndUpdate(users[index]._id, {
								$addToSet : {notification : noti2}
							}, function(err, user){
								if(err || !user){
									errorList.push(users[index]._id);
								}
								resolve();
							});
						}));
					}
				}
				if(users != null){
					Promise.all(promises2).then(function(){
						resolve();
					});
				}
				else{
					resolve();
				}
			});
		}));
		Promise.all(promises).then(function(){
			if(errorList.length == 0){
				var info={};
				info.msg = "done";
				info.code = 201;
				resolve(info);
			}
			else{
				var info={};
				info.msg = "error";
				info.code = 500;
				reject(info);
			}
		});
	});
};

var notiPutEvent = function(eventId, who_join, who_interest, eventTitle, eventPicture, detail){
	return new Promise(function(resolve, reject) {
		var fields = detail.join(", ");
		var noti = {};
		noti.title = eventTitle+" has changed its "+fields;
		noti.link = 'https://www.cueventhub.com/event?id='+eventId+'&stat=true';
		noti.photo = eventPicture;
		noti.source = eventTitle;
		noti.seen = false;
		var date = new Date();
		noti.timestamp = date.getTime();
		var errorList = [];
		var promises2 = [];
		for(let i=0;i<who_interest.length;i++){
			promises2.push(new Promise(function(resolve, reject){
				let index = i;
				User.findByIdAndUpdate(who_interest[index], {
					$addToSet : { notification : noti }
				}, function(err, user){
					if(err || !user){
						errorList.push(who_interest[index]);
						resolve();
					}
					else{
						resolve();
					}
				});
			}));
		}
		for(let i=0;i<who_join.length;i++){
			promises2.push(new Promise(function(resolve, reject){
				let index = i;
				User.findByIdAndUpdate(who_join[index], {
					$addToSet : { notification : noti }
				}, function(err, user){
					if(err || !user){
						errorList.push(who_join[index]);
						resolve();
					}
					else{
						resolve();
					}
				});
			}));
		}
		Promise.all(promises2).then(function(){
			if(errorList.length == 0){
				var info={};
				info.msg = "done";
				info.code = 201;
				resolve(info);
			}
			else{
				var info={};
				info.msg = "error";
				info.code = 500;
				reject(info);
			}
		});
	});
};

var notiDeleteEvent = function(eventId, callback){
	var errorList = [];
	Event.findById(eventId, function(err, returnedInfo){
		if(err){
			response.status(500).json({msg:"internal error."});
		}
		else if(!returnedInfo){
			response.status(404).json({msg:"event not found."});
		}
		else{
			var noti = {};
			var promises = [];
			noti.title = returnedInfo.title+" is deleted by channel's administrator.";
			noti.photo = returnedInfo.picture;
			noti.source = returnedInfo.title;
			noti.seen = false;
			var date = new Date();
			noti.timestamp = date.getTime();
			for(let i=0;i<returnedInfo.who_join.length;i++){
				promises[promises.length] = new Promise(function(resolve, reject){
					let index = i;
					User.findByIdAndUpdate(returnedInfo.who_join[index],{
					$addToSet : { notification : noti }
				},function(err, user){
					if(err || !user){
						errorList.push(returnedInfo.who_join[index]);
						resolve();
					}
					else{
						resolve();
					}
					});
				});
			}
			for(let i=0;i<returnedInfo.who_interest.length;i++){
				promises[promises.length] = new Promise(function(resolve, reject){
					let index = i;
					User.findByIdAndUpdate(returnedInfo.who_interest[index],{
					$addToSet : { notification : noti }
				},function(err, user){
					if(err || !user){
						errorList.push(returnedInfo.who_interest[index]);
						resolve();
					}
					else resolve();
					});
				});
			}
			Promise.all(promises).then(function(){
				if(errorList.length == 0){
					var info={};
					info.msg = "done";
					info.code = 201;
					callback(info);
				}
				else{
					var info={};
					info.msg = "error";
					info.code = 500;
					callback(info);
				}
			});
		}
	});
};

var notiInfoForJoinPeople = function(eventId, who_join, description, eventPicture, eventTitle){
	return new Promise(function(resolve, reject){
		var info = {};
		var noti = {};
		noti.title = description;
		noti.link = 'https://www.cueventhub.com/event?id='+eventId+'&stat=true';
		noti.photo = eventPicture;
		noti.source = eventTitle;
		noti.seen = false;
		var date = new Date();
		noti.timestamp = date.getTime();
		var errorList = [];
		var promises = [];
		for(let i=0;i<who_join.length;i++){
			promises.push(new Promise(function(resolve, reject){
				let index = i;
				User.findByIdAndUpdate(who_join[index], {
					$addToSet : {notification : noti}
				}, function(err, user){
					if(err || !user){
						errorList.push(who_join[index]);
					}
					resolve();
				});
			}));
		}
		Promise.all(promises).then(function(){
			if(errorList.length == 0){
				var info={};
				info.msg = "done.";
				info.code = 201;
				resolve(info);
			}
			else{
				var info={};
				info.msg = "error.";
				info.code = 500;
				resolve(info);
			}
		});
	});
};

exports.updateNotificationInterest = function(request, response){
	var date = new moment().tz('Asia/Bangkok');
	var date1 = new moment().tz('Asia/Bangkok');
	var current = date.toDate();
	var tmr = date1.toDate();
	var errorList = [];
	tmr.setDate(tmr.getDate()+1);
	Event.find({
		$and : [{joinable_end_time : {$lte : tmr}}, {joinable_end_time : {$gte : current}}
			, {tokenDelete : {$ne:true}}, {expire : {$ne : true}}]
	}, function(err, events){
		if(err){
			response.status(500).json({msg:"internal error."});
		}
		else{
			var promises = [];
			for(let i=0;i<events.length;i++){
					var index = i;
					var title = events[i].title+" will close the registration within 24 hours!";
					promises.push(new Promise(function(resolve, reject){
						var index = i;
						var title = events[i].title+" will close the registration within 24 hours!";
						notiInfoForJoinPeople(events[index]._id, events[index].who_interest, title, events[index].picture, events[index].title)
						.then(function(info){
							if(info.code != 201){
								errorList.push(events[index]._id);
							}
							resolve();
						});
					}));
			}
			Promise.all(promises).then(function(info){
				if(errorList.length == 0){
					response.status(201).json({msg:"done."});
				}
				else{
					response.status(500).json({msg:"error."});
				}
			});
		}
	});
};

//==============================notification==============================

var findChannelForEvent = function(id){
	return new Promise(function(resolve, reject){
		Channel.findById(id,function(err, channel){
			if(err) reject('error in finding channel');
			else if(!channel){
				reject('channel not found');
			}
			else{
				info = {};
				fields = ['picture','name'];
				for(var i = 0; i < fields.length; i++){
					if(channel[fields[i]]){
						info[fields[i]] = channel[fields[i]];
					}
				}
				resolve(info);
			}
		});
	});
};


//route DELETE /event/clear?id=...
//use in test, delte event from database
exports.clear = function(request,response,next){
	var id = request.query.id;
	var info = {};
	Event.findByIdAndRemove(id,function(err,event){
		if(err) {
			info.msg = "error";
			response.status(500).json(info);
			console.error("error find&removed event : clear - event.controllers");
			// return next(err);
		}
		else { // callback hell oh no!
			Channel.findById(event.channel,function(err,channel){
				if(err) {
					info.msg = "error1";
					response.status(500).json(info);
					console.error("error find channel : clear - event.controllers");
					// return next(err);
				}
				else if(!channel){
					info.msg = "channel not found";
					response.json(info);
					console.error("channel not found : clear - event.controllers");
				}
				else{
					channel.events.splice(channel.events.indexOf(id),1);
					channel.update(channel,function(err){
						if(err) {
							info.msg = "error2";
							response.status(500).json(info);
							console.error("error update channel : clear - event.controllers");
							// return next(err);
						}
						else{
							response.send('done');
							console.log("done");
						}
					});
				}
			});
		}
	});
}

//route GET /event/new(optional)?top=...
exports.newEvent = function(request,response,next){
	//tokenDelete must not be true
	var info={};
	Event.find({tokenDelete:{$ne:true}},function(err,events){
		if(err){
			console.error("error find event : newEvent - event.controllers");
			response.status(500).json({err:"internal error"});
			// return next(err);
		}
		if(events.length==0){
			console.error('no available event');
			response.status(200).json({err:'no available event'});
		}
		else {
			info.events = [];
			var fields = ['_id','title','picture','picture_large_zero','location','date_start', 'date_end','time_each_day'];
			var index = 0;
			var terminator = (request.query.top) ? (Math.max(0,events.length-request.query.top)) : 0;
			console.log("terminator:" + terminator);
			for(var j=events.length-1; j>=terminator;j--){
				info.events[index] = {};
				for(var i=0; i<fields.length; i++){
					if(fields[i] == 'picture_large_zero'){
						info.events[index][fields[i]] = events[j]['picture_large'][0];
					}
					else{
						info.events[index][fields[i]] = events[j][fields[i]];
					}
				}
				index++;
			}
			if(request.user){
				if(request.user.notification != undefined && request.user.notification != null){
					info.notification = request.user.notification;
					response.status(200).json(info);
				}
				else{
					response.status(200).json(info);
				}
			}
			else{
				response.status(200).json(info);
			}
		}
	});
}

//route GET /update/perday
//set expire if it's out of active date
exports.updateStatperDay = function(request,response,next){
 	//var d = new time.Date().setTimezone('Asia/Bangkok');
 	var cnt=0;
 	var info={};
 	Event.find({$and :[ {tokenDelete:{$ne:true}}, {expire:{$ne:true}} ]},function(err,events){
		if(err){
			info.msg = "unhandle error";
			response.status(500).json(info);
			// return next(err);
		}
		if(events.length==0){
			info.msg = "no active event";
			response.json(info);
			return;
		}
 		events.forEach(function(event){
			//if(event.date_end.getTime()<d.getTime()){
			if(new moment(event.date_end).isBefore(new moment()) ){
				console.log('inside moment');
				event.expire=true;
				event.update(event,function(err){
					if(err){
						info.msg = "error";
						response.status(500).json(info);
						console.error("error update event : updateStatperDay : event.controllers");
						// return next(err);
					}
				});
			}
			if(++cnt===events.length){
				info.msg = "done";
				response.json(info);
			}
			console.log("cnt:"+cnt);
		});
	});
}

var checkhot = function(hot,event){
	if(!hot['first']) hot['first']=event;
	else if(event.momentum>=hot['first'].momentum){
		if(hot['second'])	hot['third'] = hot['second'];
		hot['second'] = hot['first'];
		hot['first'] = event;
	}
	else if(!hot['second'])	hot['second']=event;
	else if(event.momentum>=hot.second.momentum){
		hot['third'] = hot['second'];
		hot['second'] = event;
	}
	else if(!hot['third'] || event.momentum>=hot.third.momentum)	hot['third']=event;
	return hot;
};

//route /update/hot
exports.updatehotEvent = function(request,response,next){
 	var hot = {};
 	//var t = new time.Date().setTimezone('Asia/Bangkok');
 	var t = new moment().format('YYYY-MM-DD');
 	//var d1 = new time.Date(t.getFullYear(),t.getMonth(),t.getDate()).setTimezone('Asia/Bangkok').getTime();
 	var d1 = new moment(t).unix();
 	var d2 = d1-86400000;
 	var d3 = d2-86400000;

 	// all event that is not delete
 	Event.find({tokenDelete:{$ne:true}},function(err,events){
 		for(var i=0;i<events.length;i++){
 			events[i].momentum = 0;
 			var t = Math.max(0,events[i].visit_per_day.length-3);
 			for(var j=events[i].visit_per_day.length-1; j>=t; j--){
 				for(var key in events[i].visit_per_day[j]){
 					//var date = new Date(key).getTime();
 					var date = new moment(key).unix();
 					if( date === d1 || date === d2 || date === d3 )
 						events[i].momentum+=events[i].visit_per_day[j][key];

	 				if(j == t){

			 			events[i].update(events[i],function(err){
			 				if(err) response.status(500).json({msg:"internal error in updatehotEvent"});
			 			});

			 			hot = checkhot(hot,events[i]);

			 			if(i+1==events.length){
					 		var field = ['_id','title','picture','momentum'];
					 		var result={};
					 		for(var key in hot){
					 			result[key] = {};
					 			for(var k=0;k<field.length;k++){
					 				result[key][field[k]] = hot[key][field[k]];
					 			}
					 		}
					 		mkdirp(path.join(__dirname,storagePath),function(err){
						 		if(err) response.status(500).json({msg:"internal error in updatehotEvent"});
						 		else{
							 		fs.writeFile(path.join(__dirname,`${storagePath}hotEvent.json`),
							 			JSON.stringify(result,null,2),function(err,data){
							 			if(err) response.status(500).json({msg:"internal error in updatehotEvent"});
							 			else response.send('done');
							 		});
						 		}
					 		});
			 			}
	 				}
 				}
 			}

			if(events[i].visit_per_day.length==0){

 				hot = checkhot(hot,events[i]);
		 		if(i+1==events.length){
					var field = ['_id','title','picture','momentum'];
					var result={};
					for(var key in hot){
			 			result[key] = {};

			 			for(var k=0;k<field.length;k++){
			 				result[key][field[k]] = hot[key][field[k]];

			 			}
			 		}
			 		mkdirp(path.join(__dirname,'../data/'),function(err){
				 		if(err) response.status(500).json({msg:"internal error in updatehotEvent"});
				 		else{
					 		fs.writeFile(path.join(__dirname,`${storagePath}hotEvent.json`),
					 			JSON.stringify(result,null,2),function(err,data){
					 			if(err) response.status(500).json({msg:"internal error in updatehotEvent"});
					 			else response.send('done');
					 		});
				 		}
			 		});
	 			}

 			}
		}
		if(events.length == 0 )response.status(500).json({err:"no event"});
 	});
}


//route /event/hot
exports.gethotEvent = function(request,response,next){
	try{
		response.sendFile(path.join(__dirname,`${storagePath}hotEvent.json`));
	}catch(err){
		response.status(500).json({"err" : "Something went wrong"});
	}
}

var querySearchEvent = function(events,info){
	return new Promise(function(resolve, reject){
		var promises = [];
		var fields = ['_id','title','picture','picture_large_zero','channel','location','date_start', 'date_end', 'time_each_day'];
		for(var j=0; j<events.length;j++){
			// add found event in array info.events
			info.events.push({});
			for(var i=0; i<fields.length; i++){
				if(fields[i] == 'channel'){
					promises[promises.length] = new Promise(function(resolve, reject){
						var index = j;
						findChannelForEvent(events[j][fields[i]]).catch(function(msg){
							info.msg = msg;     // not sure
							//response.json(info);
							reject(msg);
						}).then(function(channelInfo){
							info.events[index]['channel_name'] = channelInfo['name'];
							info.events[index]['channel_picture'] = channelInfo['picture'];
							info.events[index]['channel'] = events[index]['channel'];
							resolve();
						});
					});
				}
				else if(fields[i] == 'picture_large_zero'){
					info.events[j][fields[i]] = events[j]['picture_large'][0];
				}
				else{
					info.events[j][fields[i]] = events[j][fields[i]];
				}
			}
		}
		Promise.all(promises).then(function(){
			resolve(info);
		});

	});
};

//route /event/search?keyword=...
exports.searchEvent = function(request,response,next){
	//$option i : case insensitive
	let keys = _.get(request,'query.keyword',request.query.keywords);
	if(!keys){
		response.status(400).json({err:"no keywords"});
		return;
	}
	let info={};
	let reg = new RegExp(keys.replace(/,/g,'.*'),"g");
	Event.find( {$and : [ {title: { $regex:reg,$options:"si"}}, {tokenDelete:false}] } ,
		function(err,events){
			if(err){
				info.err = "error";
				response.status(500).json(info);
				// return next(err);
			}
			else if(events.length==0){
				info.err = "event not found";
				response.status(400).json(info);
			}
			else {
				info.events = [];
				querySearchEvent(events,info)
				.catch(function(err){
					response.status(500).json(err);
					// return next(err);
				})
				.then(function(returnedInfo){
					if(request.user){
						if(request.user.notification != undefined && request.user.notification != null){
							returnedInfo.notification = request.user.notification;
							response.status(200).json(returnedInfo);
						}
						else{
							response.status(200).json(returnedInfo);
						}
					}
					else{
						response.status(200).json(returnedInfo);
					}
				});
			}
	});
}

//This is made my Tun(onepiecetime)
exports.searchByDate = function(request,response,next){
	var info = {};
	var enddateinterval = new Date(request.query.date_end*1000); //This will include the Date that is beyond too
	var startdateinterval = new Date(request.query.date_start*1000); //request.date_start is in unix time
	console.log(request.query.date_end);
	console.log(request.query.date_start);
 	Event.find({
		$and : [ {$or : [ {$and : [ {date_end:{$gte:enddateinterval} }, {date_start:{$lte:enddateinterval} } ] 			},
											{$and :	[ {date_end:{$gte:startdateinterval} }, {date_start:{$lte:startdateinterval} } ] 	},
											{$and : [ {date_end:{$lte:enddateinterval} }, {date_start:{$gte:startdateinterval} } ] 		}
										]},
						 {tokenDelete:{$ne:true}},
						 {expire:{$ne:true}}
					 ]
	}, function(err, events){
 		if(err){
 			info.err = "error.";
 			response.status(500).json(info);
 		// 	return next(err);
 		}
 		else if(events.length==0){
 			info.err = "no event match.";
			response.status(400).json(info);
 		}
 		else {
			info.events = [];
			querySearchEvent(events,info)
			.catch(function(err){
				info.err = "error";
				response.status(500).json(info);
				// return next(err);
			})
			.then(function(returnedInfo){
				if(request.user){
					if(request.user.notification != undefined && request.user.notification != null){
						returnedInfo.notification = request.user.notification;
						response.status(200).json(returnedInfo);
					}
					else{
						response.status(200).json(returnedInfo);
					}
				}
				else{
					response.status(200).json(returnedInfo);
				}
			});
 		}
	});
}

var check_permission = function(request,callback){
	if(request.user === undefined){
		if(request.authentication_info.message === "No auth token")
			callback(403,{err:"Please login"});
		else
			callback(403,{err:request.authentication_info.message});
		return;
	}
	// check permission
	Event.findById(request.query.id,function(err,event){
		if(err){
			console.error(err);
			callback(500,{err:"internal error"});
		}
		else if(!event){
			console.error("event not found");
			callback(404,{err:"event not found"});
		}
		else{
			if(request.user.admin_events.indexOf(event._id) == -1){
				callback(403,{err:"Need permission to edit this event"});
			}
			else if(event.admins.indexOf(request.user._id) == -1){
				callback(403,{err:"Need permission to edit this event"});
			}
			else{
				// if permsion ok
				callback(200,null,event);
			}
		}
	});
}

exports.getUpcoming = function(request,response){
	const now = new Date();
 	Event.find({ 
		tokenDelete:false,
		expire:false,
		date_start: {$nin:[undefined,null]}
		},getableFieldEvent,{
			sort: {'date_start':1}	
		}, (err,events) => {
			if(err){
				console.error(err);
				response.status(500).json({err:"Internal Error"});
			}
			else{
				response.status(200).json(events);
			}
		});
	
//	.exec(function(err,events){
//		if(err){
//			console.error(err);
//			response.status(500).json({err:"Internal Error"});
//		}
//		else{
//			response.json(events);
//		}
//	});
}

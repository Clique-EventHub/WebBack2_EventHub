var Event = require('mongoose').model('Event'); // collections
var Channel = require('mongoose').model('Channel');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var moment = require('moment-timezone');

//route /
exports.hi = function(request,response,next){
	response.send("abcde");
	response.send('hi');
}

//route /listall
exports.listAll = function(request,response,next){
	Event.find({},function(err,events){
		if(err) return next(err);
		else response.json(events);
	});
}

var queryGetEvent = function(event, isStat, info){
	return new Promise(function(resolve, reject){
		var promises = [];
		var fields = ['title','about','video','channel','location','date_start','expire',
		'date_end','picture','picture_large','year_require','faculty_require','tags'];
		if(isStat) fields.push(['visit']);
		for(var i=0; i<fields.length; i++){
			if(event[fields[i]] || fields[i]=='expire'){
				if((fields[i]==='year_require'||fields[i]==='faculty_require')){
					if(event[fields[i]].length>0){
						info[fields[i]] = event[fields[i]];
					}
				}
				else if(fields[i] == 'channel'){
					promises[promises.length] = new Promise(function(resolve, reject){
						findChannelForEvent(event[fields[i]]).catch(function(msg){
							info.msg = msg;     // not sure
							response.json(info);
							resolve();
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
//route /event?id=...&stat=bool
exports.getEvent = function(request,response,next){
	var id = request.query.id;
	var info = {};
	Event.findById(id,function(err,event){
		if(err) return next(err);
		else if(!event){
			info.msg = "event not found";
			response.status(404).json(info);
		}
		else{
			var isStat = false;
			if(request.query.stat) isStat = true;
			queryGetEvent(event, isStat, info)
			.catch(function(err){
				info.msg = "error";
				response.json(info);
				return next(err);
			}).then(function(returnedInfo){
				response.json(returnedInfo);
				putStat2(id);
			});
		}
	});
}

//route POST /event with req body
exports.postEvent = function(request,response,next){
	//var d = new time.Date().setTimezone('Asia/Bangkok');
	//var date = d.getMonth()+1 +'/'+d.getDate()+'/'+d.getFullYear();
	var date = new moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
	var newEvent = new Event(request.body);
	var info = {};
	newEvent.visit_per_day.push({});	// keep stat visit per day as object
	newEvent.visit_per_day[0][date]=0;	// set defuat of created day as 0
	newEvent.save(function(err){		// save new event
		if(err){
			info.msg = "error";
			console.error("error at postEvent : event.controllers");
			response.json(info);
			return next(err);
		}
		else{
			var channelId = newEvent.channel;
			var condition = {$push:{}};				// condition for update channel
			condition.$push.events = newEvent._id;	// push newEvent id to channel events field
			Channel.findByIdAndUpdate(channelId,condition,function(err,channel){
				if(err){
					info.msg = "error1";
					console.error("error1 : postEvent - event.controllers");
					response.json(info);
					return next(err);
				}
				else if(!channel){
					info.msg = "channel not found";
					console.error("channel not found : postEvent - event.controllers");
					response.status(404).json(info);
				}
				else{
					info.id = newEvent._id;
					console.log("post new Event");
					response.status(201).json(info);
				}
			});
		}
	});
}

// route PUT /event?id=... with req body
exports.putEvent = function(request,response,next){
	var id = request.query.id;
	var info = {msg:"done"};
	request.body.lastModified = new moment();	// update lastModified
	Event.findByIdAndUpdate(id,{
		$set:request.body						// update body
	},function(err,updatedEvent){
		if(err){
			info.msg = "error";
			response.json(info);
			console.error("error : putEvent - event.controllers");
			return next(err);
		}
		else if(!updatedEvent){
			info.msg = "event not found";
			console.error("event not found : putEvent - event.controllers");
			response.status(404).json(info);
		}
		else response.json(info);
	});
}

// route DELETE /event?id=...
// call from deleteEvent
var updateDeleteEventToChannel = function(channelId,eventId,response){
	var info = {msg:"done"};
	Channel.findById(channelId,function(err,channel){
		if(err){
			info.msg = 'error1';
			console.error("error1 : updateDeleteEventToChannel - event.controllers");
			response.json(info);
			return next(err);
		}
		else if(!channel){
			info.msg = "channel not found";
			console.error("error2 : updateDeleteEventToChannel - event.controllers");
			response.status(404).json(info);
		}
		else{	// move deleted event to bin array
			channel.events_bin.push(eventId);
			channel.events.splice(channel.events.indexOf(eventId),1);
			channel.update(channel,function(err){
				if(err){
					info.msg = "error3";
					response.json(msg);
					console.error("error3 : updateDeleteEventToChannel - event.controllers");
					return next(err);
				}
				else response.json(info);
			});
		}
	});
};

//route DELETE /event?id=...
exports.deleteEvent = function(request,response,next){
	var id = request.query.id;
	var info = {msg:"done"};
	Event.findByIdAndUpdate(id,{
		tokenDelete:true,		// set tokenDelete
		lastModified:new moment()	// update lastModified
	},function(err,event){
		if (err){
			info.msg = "error";
			console.error("error : deleteEvent - event.controllers");
			response.json(info);
			return next(err);
		}
		else if(!event){
			info.msg = 'event not found';
			console.error("event not found : deleteEvent - event.controllers");
			response.json(info);
		}
		else updateDeleteEventToChannel(event.channel,id,response);
	});
}

//route GET /event/stat?id=...
exports.getStat = function(request,response,next){
	var id = request.query.id;
	var info = {};
	Event.findById(id,function(err,event){
		if(err){
			info.msg = "error";
			console.error("error find event: getStat - event.controllers");
			response.json(info);
			return next(err);
		}
		else{
			if(!event){
				info.msg = "event not found";
				response.status(404).json(info);
			}
			else{
				var fields = ['visit','visit_per_day'];
				for(var i=0;i<fields.length;i++){
					info[fields[i]]=event[fields[i]];
				}
				response.json(info);
			}
		}
	});
}

//route PUT /event/stat?id=...
exports.putStat = function(request,response,next){
	var id = request.query.id;
	//var d = new time.Date().setTimezone('Asia/Bangkok');
	//var d = moment().tz('Asia/Bangkok');
	//var date = d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear();
	var date = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
	var info={};
	Event.findById(id,function(err,event){
		if(err){
			info.msg = "error";
			response.json(info);
			console.error("error find event : putStat - event.controllers");
			return next(err);
		}
		else if(!event){
			info.msg = "event not found";
			response.status(404).json(info);
		}
		else{
			event.lastModified = new moment();
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
					info.msg = "error1";
					response.json(info);
					console.error("error1 update event : putStat - event.controllers");
					return next(err);
				}
				else{
					info.msg = "done";
					response.json(info);
				}
			});
		}
	});
}

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

var putStat2 = function(id){
	//var d = new time.Date().setTimezone('Asia/Bangkok');
	//var date = d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear();
	var date = new moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
	Event.findById(id,function(err,event){
		if(err){
			console.error("error find event : putStat - event.controllers");
			return next(err);
		}
		else if(!event){
			info.msg = "event not found";
			console.error("event not found");
		}
		else{
			event.lastModified = moment().format();
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
					return next(err);
				}
				else{
					console.log("done");
				}
			});
		}
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
			response.json(info);
			console.error("error find&removed event : clear - event.controllers");
			return next(err);
		}
		else { // callback hell oh no!
			Channel.findById(event.channel,function(err,channel){
				if(err) {
					info.msg = "error1";
					response.json(info);
					console.error("error find channel : clear - event.controllers");
					return next(err);
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
							response.json(info);
							console.error("error update channel : clear - event.controllers");
							return next(err);
						}
						else{
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
			info.msg = "error";
			console.error("error find event : newEvent - event.controllers");
			return next(err);
		}
		if(events.length==0){
			info.msg='no available event';
			console.error('no available event');
			response.json(info);
		}
		else {
			info.events = [];
			var fields = ['_id','title','picture','picture_large_zero','location','date_start', 'date_end'];
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
			response.json(info);
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
			response.json(info);
			return next(err);
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
						response.json(info);
						console.error("error update event : updateStatperDay : event.controllers");
						return next(err);
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
 			for(var j=events[i].visit_per_day.length-1;j>=t;j--){
 				for(var key in events[i].visit_per_day[j]){
 					//var date = new Date(key).getTime();
 					var date = new moment(key).unix();
 					if( date === d1 || date === d2 || date === d3 )
 						events[i].momentum+=events[i].visit_per_day[j][key];

	 				if(j == t){
			 			events[i].update(events[i],function(err){
			 				if(err) return next(err);
			 			});

			 			hot = checkhot(hot,events[i]);

			 			if(i+1==events.length){
							var promises = [];
					 		var field = ['_id','title','picture','momentum','channel'];
					 		var result={};
					 		for(var key in hot){
					 			result[key] = {};
					 			for(var k=0;k<field.length;k++){
					 				result[key][field[k]] = hot[key][field[k]];
					 			}
								promises[promises.length] = new Promise(function(resolve, reject){
									var index = key;
									findChannelForEvent(hot[key]['channel']).catch(function(msg){
										console.log('can not find channel for hot events!');
										resolve();
									}).then(function(channelInfo){
										result[index]['channel_name'] = channelInfo['name'];
										result[index]['channel_picture'] = channelInfo['picture'];
										resolve();
									});
								});
							}
							Promise.all(promises).then(function(){
								mkdirp(path.join(__dirname,'../data/'),function(err){
							 		if(err) return next(err);
							 		else{
								 		fs.writeFile(path.join(__dirname,'../data/hotEvent.json'),
								 			JSON.stringify(result,null,2),function(err,data){
								 			if(err) return next(err);
								 			else response.send('done');
								 		});
							 		}
						 		});
							});
			 			}
	 				}
 				}
 			}
			if(events[i].visit_per_day.length==0){
 				hot = checkhot(hot,events[i]);
		 		if(i+1==events.length){
					var promises = [];
					var field = ['_id','title','picture','momentum','channel'];
					var result={};
					for(var key in hot){
			 			result[key] = {};
			 			for(var k=0;k<field.length;k++){
			 				result[key][field[k]] = hot[key][field[k]];
			 			}
						promises[promises.length] = new Promise(function(resolve, reject){
							var index = key;
							findChannelForEvent(hot[key]['channel']).catch(function(msg){
								console.log('can not find channel for hot events!');
								resolve();
							}).then(function(channelInfo){
								result[index]['channel_name'] = channelInfo['name'];
								result[index]['channel_picture'] = channelInfo['picture'];
								resolve();
							});
						});
			 		}
					Promise.all(promises).then(function(){
						mkdirp(path.join(__dirname,'../data/'),function(err){
							if(err) return next(err);
							else{
								fs.writeFile(path.join(__dirname,'../data/hotEvent.json'),
									JSON.stringify(result,null,2),function(err,data){
									if(err) return next(err);
									else response.send('done');
								});
							}
						});
					});
	 			}
 			}
		}
 	});
}


//route /event/hot
exports.gethotEvent = function(request,response,next){
	response.sendFile(path.join(__dirname,'../data/hotEvent.json'));
}

var querySearchEvent = function(events,info){
	return new Promise(function(resolve, reject){
		var promises = [];
		var fields = ['_id','title','picture','picture_large_zero','channel','location','date_start', 'date_end'];
		for(var j=0; j<events.length;j++){
			// add found event in array info.events
			info.events.push({});
			for(var i=0; i<fields.length; i++){
				if(fields[i] == 'channel'){
					promises[promises.length] = new Promise(function(resolve, reject){
						var index = j;
						findChannelForEvent(events[j][fields[i]]).catch(function(msg){
							info.msg = msg;     // not sure
							response.json(info);
							resolve();
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
	var info={};
	Event.find( {$and : [ {title: { $regex:request.query.keyword,$options:"i"}}, {tokenDelete:false}] } ,
		function(err,events){
			if(err){
				info.msg = "error";
				response.json(info);
				return next(err);
			}
			else if(events.length==0){
				info.msg = "event not found";
				response.status(404).json(info);
			}
			else {
				info.events = [];
				querySearchEvent(events,info)
				.catch(function(err){
					info.msg = "error";
					response.json(info);
					return next(err);
				})
				.then(function(returnedInfo){
					response.json(returnedInfo);
				});
			}
	});
}

/*exports.searchByDate = function(request,response,next){
	var info = {};
 	Event.find({
		$and : [{tokenDelete:{$ne:true}}, {expire:{$ne:true}} ]
	}, function(err, events){
 		if(err){
 			info.msg = "error.";
 			response.json(info);
 			return next(err);
 		}
 		else if(events.length==0){
 			info.msg = "no event match.";
			response.status(404).json(info);
 		}
 		else {
			var fields = ['_id','title','picture','channel','location','date_start', 'date_end'];
			info.events = [];
			for(var j=0; j<events.length;j++){
				// add found event in array info.events
				if(request.query.date_start <= Date.parse(event.date_start).getTime()/1000
				&& request.query.date_start + request.query.interval <= Date.parse(event.date_end).getTime()/1000){

					info.events.push({});
					for(var i=0; i<fields.length; i++){
						info.events[j][fields[i]] = events[j][fields[i]];
					}
				}
			}
 			// info is {events:[ {},{},.. ]}
 			response.json(info);
 		}
	});
}*/

//This is made by Tun(onepiecetime)

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
 			info.msg = "error.";
 			response.json(info);
 			return next(err);
 		}
 		else if(events.length==0){
 			info.msg = "no event match.";
			response.status(404).json(info);
 		}
 		else {
			info.events = [];
			querySearchEvent(events,info)
			.catch(function(err){
				info.msg = "error";
				response.json(info);
				return next(err);
			})
			.then(function(returnedInfo){
				response.json(returnedInfo);
			});
 		}
	});
}

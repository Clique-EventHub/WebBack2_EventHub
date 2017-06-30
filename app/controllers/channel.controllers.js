var Channel = require('mongoose').model('Channel');	// require model database
var Event = require('mongoose').model('Event');		//
var moment = require('moment-timezone');
var User = require('mongoose').model('User');
var utility = require('../../config/utility');
// list all channel
exports.listAll = function(request,response,next){
	Channel.find({},function(err,channel){
		if(err) response.status(500).json({err:"internal error"});
		else{
			var info = channel;
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

// route GET /channel?id=...
exports.getChannel = function(request,response){
	var id = request.query.id;

	var info = {};
	Channel.findById(id,function(err,channel){
		if(err){
			console.error("\x1b[31m",new moment().tz('Asia/Bangkok').toString());
			console.error("\x1b[37m",err);
			response.status(500).json({msg:"channel not found"});
		}
		else if(!channel){
			info.msg = 'channel not found';
			response.status(404).json(info);
		}
		else{
			var fields = ['_id','name','verified','picture','picture_large','admins','events','detail','url','video'];
			for(var i=0;i<fields.length;i++){
				if(channel[fields[i]]){
					if(fields[i]==='admins'||fields[i]==='events'){
	;					if(channel[fields[i]].length>0)
							info[fields[i]]=channel[fields[i]];
					}
					else
						info[fields[i]]=channel[fields[i]];
				}
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

//route POST /channel with json body (information of new channel)
exports.postChannel = function(request,response,next){
	var obj = {};
	for(let i=0;i<utility.editableFieldChannel.length;i++){
		if(request.body[utility.editableFieldChannel[i]]){
			obj[utility.editableFieldChannel[i]] = request.body[utility.editableFieldChannel[i]];
		}
	}
	var newChannel = new Channel(obj);	// create new channel
	newChannel.admins.push(request.user._id);
	var info = {};
	newChannel.save(function(err){
		if(err) {
			console.error(err);
			info.msg = "err";
			response.status(500).json(info);
			// return next(err);
		}
		else {
			info.id = newChannel._id;

			if(request.user){

				User.findByIdAndUpdate(request.user._id,{
					$push : {admin_channels: newChannel._id}
				},(err) => console.error(err));

				if(request.user.notification != undefined && request.user.notification != null){
					info.notification = request.user.notification;
					response.status(201).json(info);
				}
				else{
					response.status(201).json(info);
				}
			}
			else{
				response.status(201).json(info);
			}
		}
	});
}

// route PUT /channel?id=...
exports.putChannel = function(request,response,next){
	var id = request.query.id;
	// validate input data
	if(id === undefined ){
			response.status(400).json({err:"invalid channel"});
			return;
	}
	checkChannelAvailable(id).catch(function(info){
		response.status(info.code).json({msg:info.msg});
	}).then(function(info){
		// chcek permission
		if(request.user){
			if(request.user.admin_channels.indexOf(id) == -1){
				response.status(403).json({err:"No permission for edit channel"});
				return;
			}
		}
		else{
			if(Object.keys(request.authen).length == 0 )
				response.status(403).json({err:"Please login"});
			else
				response.status(403).json({err:request.authen});
			return;
		}
		var editableFields = utility.editableFieldChannel;
		var editObj = {};
		for(let i=0;i<editableFields.length;i++){
			if(request.body.hasOwnProperty(editableFields[i])){
				editObj[editableFields[i]] = request.body[editableFields[i]];
			}
		}
		if(!(Object.keys(editObj).length === 0 && editObj.constructor === Object)){
			Channel.findByIdAndUpdate(id,{
				 // $set : use request body as updated information
				// same field will be overwritten , new field will be created
				$set:editObj,
				// write current date in formate "Date" in field lastModified
				$currentDate:{lastModified:"Date"}
			},function(err,channel){
				if(err){
					var info = {};
					info.msg = "error";
					response.status(500).json(info);
				}
				else if(!channel){
					var info = {};
					info.msg = "channel not found.";
					response.status(404).json(info);
				}
				else{
					var info = {};
					info.msg = "done";
					if(request.user){
						if(request.user.notification != undefined && request.user.notification != null){
							info.notification = request.user.notification;
							response.status(201).json(info);
						}
						else{
							response.status(201).json(info);
						}
					}
					else{
						response.status(201).json(info);
					}
				}
			});
		}
		else{
			if(request.user){
				var info = {};
				info.msg = "done.";
				if(request.user.notification != undefined && request.user.notification != null){
					info.notification = request.user.notification;
					response.status(201).json(info);
				}
				else{
					response.status(201).json(info);
				}
			}
			else{
				response.status(201).json(info);
			}
		}
	});
}

// route DELTE /channel?id=...
exports.deleteChannel = function(request,response,next){
	var id = request.query.id;
	var info = {};

	if(id === undefined ){
			response.status(400).json({err:"invalid channel"});
			return;
	}

	// chcek permission
	if(request.user){
		if(request.user.admin_channels.indexOf(id) == -1){
			response.status(403).json({err:"No permission for delete channel"});
			return;
		}
	}
	else{
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
		return;
	}

	//use tokenDelete to show as it delete, and not shown when user search
	Channel.findByIdAndUpdate(id,{
		tokenDelete:true,
		lastModified:Date()
	},function(err,channel){
		if (err){
			info.msg = "error0";
			response.status(500).json(info);
			console.error("error while find channel : deleteChannel-channel.controllers");
			// return next(err);
		}
		else {
			//delete all event in the channel
			for(var i=0;i<channel.events.length;i++){
				Event.findByIdAndUpdate(channel.events[i],{
					tokenDelete:true,
					lastModified:new moment()
				},function(err,event){
					if (err){
						info.msg = "internal error : deleteChannel";
						// response.status(500).json(info);
						console.error("error while find event : deleteChannel-channel.controllers");
						// return next(err);
					}
					else if(!event){
						info.msg = "event not found";
						// response.status(404).json(info);
						console.error('event not found:'+channel.events[i]+"deleteChannel-channel.controllers");
					}
				});
			}
		}
		info.msg = "done";
		if(request.user){
			if(request.user.notification != undefined && request.user.notification != null){
				info.notification = request.user.notification;
				response.status(201).json(info);
			}
			else{
				response.status(201).json(info);
			}
		}
		else{
			response.status(201).json(info);
		}
	});
}


//route GET /channel/stat=id?...
//inner function of getStat
var calStat = function(channel,callback){
    var info={visit:0};
    // find events in channel
    Event.find({_id: {$in:channel.events}},function(err,events){
        if(err){
        	info.msg = "error2";
					info.code = 500;
        	console.error("error at find event in channel : calStat-channel.controllers");
        	callback(info);
        	// return next(err);
        }
        else if(events){
           	//console.log(events);
            events.forEach(function(event){
              info.visit += event.visit;
            	console.log('event.visit:'+event.visit);
            	console.log(info.visit);
            });
            console.log(info);
        }
        callback(info);
    });
}

//route GET /channel/stat?id=...
//return sum of visit in every events in the channel
exports.getStat = function(request,response,next){
	// chcek permission
	if(request.user){
		if(request.user.admin_channels.indexOf(request.query.id) == -1){
			response.status(403).json({err:"No permission to access data."});
			return;
		}
	}
	else{
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
		return;
	}
	var id = request.query.id;
	var info = {};
	Channel.findById(id,function(err,channel){
		if(err){
			info.msg = "internal error getStat";
			console.error("error at find channel : getStat-channel.controllers");
			response.status(500).json(info);
			// return next(err);
		}
		else if(!channel){
			info.msg = "channel not found"
			console.error("channel not found : getStat-channel.controllers");
			response.status(404).json(info);
		}
		else{
			calStat(channel,function(info){
				if(info.msg){
						response.status(info.code).json({msg:info.msg});
						return ;
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
			});
		}
	});
}


//route DELETE /channel/clear?id=...
//delete channel, not in use
exports.clear = function(request,response,next){
	var id = request.query.id;
	Channel.findByIdAndRemove(id,function(err){
		if(err) response.status(500).json({msg:"internal error from clear"});
		else response.send('removed:'+id);

	});
}


//route GET /channel/search?keyword=...
exports.searchChannel = function(request,response,next){
	var info = {};
	//$and : regex and tokenDelete true
	//$option i : case insensitive , match both upper and lower
	Channel.find({$and : [ {name: { $regex:request.query.keyword,$options:"i"}}, {tokenDelete:false}] },
		function(err,channels){
			if(err){
				info.msg = "Something went wrong";
				console.error("\x1b[31m",new moment().tz('Asia/Bangkok').toString());
				console.error("error at find channel : searchChannel-channel.controllers");
				console.error("\x1b[37m",err);
				response.status(500).json(info);
				// return next(err);
			}
			else if(channels.length==0){
				info.msg = "channel not found";
				response.status(404).json(info);
			}
			else {
				var fields = ['_id','name','picture'];
				info.channels = [];
				for(var j=0; j<channels.length;j++){
					//add found event in array info.channels
					info.channels.push({});
					for(var i=0; i<fields.length; i++){
					 	info.channels[j][fields[i]] = channels[j][fields[i]];
					}
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

var checkChannelAvailable = function(channelId){
	return new Promise(function(resolve,reject){
		Channel.findById(channelId, function(err, channel){
			if(err){
				var info = {};
				info.code = 500;
				info.msg = "internal error.";
				reject(info);
			}
			else if(!channel || channel['tokenDelete'] ){
				var info = {};
				info.code = 404;
				info.msg = "channel not found.";
				reject(info);
			}
			else{
				var info = {};
				info.code = 200;
				info.msg = "done.";
				resolve(info);
			}
		});
	});

};

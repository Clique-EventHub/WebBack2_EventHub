var Channel = require('mongoose').model('Channel');	// require model database
var Event = require('mongoose').model('Event');		//
var moment = require('moment-timezone');
// list all channel
exports.listAll = function(request,response,next){
	Channel.find({},function(err,channel){
		if(err) return next(err);
		else response.json(channel);
	});
}

// route GET /channel?id=...
exports.getChannel = function(request,response){
	var id = request.query.id;
	var info = {};
	Channel.findById(id,function(err,channel){
		if(err) return next(err);
		else if(!channel){
			info.msg = 'channel not found';
			response.status(404).json(info);
		}
		else{
			var fields = ['name','verified','picture','picture_large','admins','events'];
			for(var i=0;i<fields.length;i++){
				if(channel[fields[i]]){
					if(fields[i]==='admins'||fields[i]==='events'){
						if(channel[fields[i]].length>0)
							info[fields[i]]=channel[fields[i]];
					}
					else
						info[fields[i]]=channel[fields[i]];
				}
			}
			response.json(info);
		}
	});
}

//route POST /channel with json body (information of new channel)
exports.postChannel = function(request,response,next){
	var newChannel = new Channel(request.body);	// create new channel
	var info = {};
	newChannel.save(function(err){
		if(err) {
			info.msg = "err";
			response.json(info);
			return next(err);
		}
		else {
			info.id = newChannel._id;
			response.status(201).json(info);
		}
	});
}

// route PUT /channel?id=...
exports.putChannel = function(request,response,next){
	var id = request.query.id;
	var info = {};

	// validate input data
	if(id === undefined ){
			response.status(400).json({err:"invalid channel"});
			return;
	}

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

	Channel.findByIdAndUpdate(id,{
		 // $set : use request body as updated information
		// same field will be overwritten , new field will be created
		$set:request.body,
		// write current date in formate "Date" in field lastModified
		$currentDate:{lastModified:"Date"}
	},function(err,channel){
		if(err){
			info.msg = "error";
			response.json(info);
			return next(err);
		}
		else if(!channel){
			info.msg = "channel not found"
			response.status(400).json(info);
		}
		else{
			info.msg = "done";
			response.status(200).json(info);
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
			response.json(info);
			console.error("error while find channel : deleteChannel-channel.controllers");
			return next(err);
		}
		else {
			//delete all event in the channel
			for(var i=0;i<channel.events.length;i++){
				Event.findByIdAndUpdate(channel.events[i],{
					tokenDelete:true,
					lastModified:new moment()
				},function(err,event){
					if (err){
						info.msg = "error1";
						response.json(info);
						console.error("error while find event : deleteChannel-channel.controllers");
						return next(err);
					}
					else if(!event){
						info.msg = "error2";
						console.error('event not found:'+channel.events[i]+"deleteChannel-channel.controllers");
					}
				});
			}
		}
		info.msg = "done";
		response.status(200).json(info);
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
        	console.error("error at find event in channel : calStat-channel.controllers");
        	callback(info);
        	return next(err);
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
	var id = request.query.id;
	var info = {};
	Channel.findById(id,function(err,channel){
		if(err){
			info.msg = "error";
			console.error("error at find channel : getStat-channel.controllers");
			response.json(info);
			return next(err);
		}
		else if(!channel){
			info.msg = "channel not found"
			console.error("channel not found : getStat-channel.controllers");
			response.status(404).json(info);
		}
		else{
			calStat(channel,function(info){
				response.json(info);
			});
		}
	});
}


//route DELETE /channel/clear?id=...
//delete channel, not in use
exports.clear = function(request,response,next){
	var id = request.query.id;
	Channel.findByIdAndRemove(id,function(err){
		if(err) return next(err);
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
				info.msg = "error";
				console.error("error at find channel : searchChannel-channel.controllers");
				response.json(info);
				return next(err);
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
				response.json(info);
			}
	});
}

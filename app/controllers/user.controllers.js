var User = require('mongoose').model('User');
var Channel = require('mongoose').model('Channel');
var Event = require('mongoose').model('Event');
var config = require('../../config/config');
var jwt = require('jsonwebtoken');
var http = require('http');
var https = require('https');
var passport = require('passport');
var moment = require('moment-timezone');
var querystring = require('querystring');


exports.render = function(request, response){
	response.render('user-login',{
		title: 'Login EventHub',
		firstName: request.user ? request.user.firstName : '',
		message: request.flash('error')
	});

}

//body id wtf?
// exports.joinAnEvent = function(request, response, next){
//   var user = request.user;
// 	if(user){
// 		Event.findById(request.query.id,function(err, event){
// 			if(err){
// 				response.status(500).json({err:"internal error"});
// 			}
// 			else if(!event || event['tokenDelete']){
// 				response.status(404).json({err:'event not found'});
// 			}
// 			else{
// 				User.findByIdAndUpdate(user._id,{
// 					$push : {"join_events" : request.query.id}
// 				},function(err){
// 					if(err) response.status(500).json({err:"internal error"});
// 					else {
// 						var responseObject = {msg:"done"};
// 						if(request.user.notification != undefined && request.user.notification != null){
// 							responseObject.notification = request.user.notification;
// 							response.status(200).json(responseObject);
// 						}
// 						else{
// 							response.status(200).json(responseObject);
// 						}
// 					}
// 				});
// 			}
// 		});
// 	}
// 	else{
// 		if(Object.keys(request.authen).length == 0 )
// 			response.status(403).json({err:"Please login"});
// 		else
// 			response.status(403).json({err:request.authen});
// 	}
// };

exports.joinAnEvent = function(request, response, next){
	if(request.user){
		checkUserAndEvent(request.user, request.query.id)
		.then(function(returnedInfo){
      if(returnedInfo.hasOwnProperty('msg')){
				//console.log("has problem msg");
        response.status(returnedInfo.code).json({msg:returnedInfo.msg});
      }
			var promises = [];
			promises[0] = new Promise(function(resolve, reject){
				Event.findByIdAndUpdate(returnedInfo.event, {
					$addToSet : {
						"who_join" : returnedInfo.user
					},
					$set : { "lastModified" : new moment() }
				}, function(err, updatedEvent){
						if(err){
							var info = {};
							info.msg = "Event internal error.";
							info.code = 500;
							//console.error("error : joinAnEvent");
							reject(info);
						}
						else if(!updatedEvent){
							var info = {};
							info.msg = "Event not found."
							info.code = 404;
							//console.error("error : joinAnEvent");
							reject(info);
						}
						else{
							var info = {};
							info.who_join = updatedEvent.who_join;
							//console.log('no worries event');
							resolve(info);
						}
			})});
			promises[1] = new Promise(function(resolve, reject){
					User.findByIdAndUpdate(returnedInfo.user, {
	        $addToSet : {
	          join_events : returnedInfo.event
	        },
	        $set : {"lastModified" : new moment(), "lastOnline" : new moment()}
	      	},function(err, updatedUser){
	        if(err){
	          var info = {};
	          info.msg = "User internal error.";
						info.code = 500;
						//console.error("error : joinAnEvent");
	          reject(info);
	        }
	        else if(!updatedUser){
	          var info = {};
	          info.msg = "User not found."
						info.code = 404;
						//console.error("error : joinAnEvent");
	          reject(info);
	        }
	        else{
	          var info = {};
	          info.join_events = updatedUser.join_events;
						//console.log('no worries user');
	          resolve(info);
	        }
	     })});
      Promise.all(promises)
			.catch(function(returnedInfo){
				response.status(returnedInfo.code).json({msg:returnedInfo.msg});
				return ;
			})
      .then(function(returnedValue){
        var info = {};
        // if(returnedValue[0].hasOwnProperty('msgEvent')){
				//
        //   console.log('error in joinAnEvent - user.controllers.js');
        //   //we have to remove admin from model, too.
        //   //this case should not happen since we have checked the data before.
        //   info['msgEvent'] = returnedValue[0]['msgEvent'];
        // }
        // else{
        //   info['who_join'] = returnedValue[0]['who_join'];
        // }
        // if(returnedValue[1].hasOwnProperty('msgUser')){
        //   console.log('error in joinAnEvent - user.controllers.js');
        //   //we have to remove admin from model, too.
        //   //this case should not happen since we have checked the data before.
        //   info['msgUser'] = returnedValue[1]['msgUser'];
        // }
        // else{
        //   info['join_events'] = returnedValue[1]['join_events'];
        // }
				info.who_join = returnedValue[0]['who_join'];
				info.join_events = returnedValue[1]['join_events'];
				if(request.user.notification != undefined && request.user.notification != null){
					info.notification = request.user.notification;
					response.status(200).json(info);
				}
				else{
					response.status(200).json(info);
				}
			});
		});
	}
	else{
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
	}
};

exports.interestAnEvent = function(request, response, next){
	if(request.user){
		checkUserAndEvent(request.user, request.query.id)
		.then(function(returnedInfo){
      if(returnedInfo.hasOwnProperty('msg')){
        response.status(returnedInfo.code).json({msg:returnedInfo.msg});
      }
			putInterest(returnedInfo.event, request.user,function(returnedValue){
				response.status(returnedValue.code).json({msg:returnedValue.msg});
			});
		});
	}
	else{
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
	}
};


exports.uninterestAnEvent = function(request, response, next){
	if(request.user){
		checkUserAndEvent(request.user, request.query.id)
		.then(function(returnedInfo){
			if(returnedInfo.hasOwnProperty('msg')){
				response.status(returnedInfo.code).json({msg:returnedInfo.msg});
			}
			unputInterest(returnedInfo.event, request.user, function(returnedValue){
				response.status(returnedValue.code).json({msg : returnedValue.msg});
			});
		});
	}
	else{
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
	}
};

//in debugging process only
//priority concern
exports.listAll = function(request,response,next){
	User.find({},function(err,users){
		if(err) response.status(500).json({err:"internal error"});
		else{
			var info = users;
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

/*exports.logout = function(request,response){
	request.logout();
	var info = {};
	info.msg = "done";
  response.json(info);
}*/

exports.getProfile = function(request, response){
	var user = request.user;
	var res = {};
	var fields = ['_id','firstName','lastName','picture','picture_200px',
	'gender','phone','shirt_size','brith_day','allergy','disease',
	'regId','facebookId','twitterUsername','lineId','notification','firstNameTH','lastNameTH'];
	if(user){
		fields.forEach(function(field){
			if(field != 'notification' || (field == 'notification' && (user[field] != undefined && user[field] != null))){
					res[field] = user[field];
			}
		});
		response.status(200).json(res);

	}
	else{
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
	}
};
// require body
exports.putEditProfile = function(request, response){
	var res = {};
	var user = request.user;
	if(user){
		console.log('editing...');
		var keys = Object.keys(request.body);
		var editableFields = ['nick_name','picture','phone','shirt_size','allergy','disease','profileUrl','twitterUsername'
													,'lineId','admin_channels','subscribe_channels','notification'];
		for(var i=0;i<keys.length;i++){
			if(editableFields.indexOf(keys[i]) == -1){
				delete request.body[keys[i]];
			}
		}
		//Actually we should check its content later, too. For security reason.
		User.findByIdAndUpdate(user._id,{
			$set:request.body						// update body
		},function(err,updatedUser){
			if(err){
				response.status(500).json({err:"internal error"});
				console.error("error : putEditProfile");
				return ;
			}
			else if(!updatedUser){
				info.err = "user not found";
				console.error("user not found : postEditProfile - user.controllers");
				response.status(404).json(info);
			}
			else {
				var info={msg:"done"};
				if(request.user.notification != undefined && request.user.notification != null){
					info.notification = request.user.notification;
					response.status(200).json(info);
				}
				else{
					response.status(200).json(info);
				}
			}
		});
	}
	else{
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
	}
}


var queryFindChannelForUser = function(id){
  return new Promise(function(resolve, reject){
		Channel.findById(id,function(err, channel){
			if(err) {
				var info={};
				info.msg = 'internal error in finding channel';
				info.code = 500;
				reject(info);
			}
			else if(!channel){
				var info={};
				info.msg = 'channel not found';
				info.code = 404;
				reject(info);
			}
			else{
        var info = {};
        if(!channel['tokenDelete']){
          fields = ['picture','name'];
          for(var i = 0; i < fields.length; i++){
  					if(channel[fields[i]]){
  						info[fields[i]] = channel[fields[i]];
  					}
  				}
        }
				resolve(info);
			}
		});
	});
};

exports.getSubbedChannnel = function(request,response){
  if(request.user){
    var info = {};
    var promises = [];
    var channels = request.user.subscribe_channels;
    for(var i=0; i<channels.length; i++){
      promises[promises.length] = new Promise(function(resolve, reject){
        queryFindChannelForUser(channels[i])
        .catch(function(returnedInfo){
          info.msg = returnedInfo.msg;
					info.code = returnedInfo.code;
					console.log('error from queryFindChannelForUser');
          reject(info);
        })
        .then(function(channelInfo){
          info[channelInfo.name] = channelInfo.picture;
          resolve();
        });
      });
    }
    Promise.all(promises)
		.catch(function(returnedInfo){
			response.status(returnedInfo.code).json({msg:returnedInfo.msg});
			return ;
		})
		.then(function(){
			if(request.user.notification != undefined && request.user.notification != null){
				info.notification = request.user.notification;
				response.status(200).json(info);
			}
			else{
				response.status(200).json(info);
			}
		});
  }
	else{
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
	}
}

var queryFindEventForUser = function(id){
  return new Promise(function(resolve, reject){
    var info = {};
		var fields = ['title','channel','picture'];
    Event.findById(id, function(err, event){
      var thisEvent = event;
      if(err) {
				info.msg = "internal error : queryFindEventForUser"
				info.code = 500;
				reject(info);
			}
  		else if(!event){
  			info.msg = "event not found : queryFindEventForUser";
				info.code = 404;
				reject(info);
  		}
  		else{
        if(!event['tokenDelete']){
          queryFindChannelForUser(event.channel)
          .catch(function(err){
            reject(err);
          }).then(function(returnedInfo){
            var value = {};
            value['picture'] = thisEvent['picture'];
            value['channel'] = returnedInfo['name'];
            value['channel_picture'] = returnedInfo['picture'];
						value['channel_id'] = event.channel;
            info[thisEvent['title']] = value;
						resolve(info);
          });
        }
				else{
					info.msg = "event deleted : queryFindEventForUser";
					info.code = 404;
					reject(info);
				}
  		}
    });
	});
};

exports.getJoinedEvent = function(request,response){
  if(request.user){
    var info = {};
    info.events = [];
    var promises = [];
    var events = request.user.join_events;
    for(var i=0; i<events.length; i++){
			// console.log("events[i] = "+events[i]);
      promises[promises.length] = new Promise(function(resolve, reject){
				var index = i;
        queryFindEventForUser(events[i])
        .catch(function(returnedInfo){
          response.status(returnedInfo.code).json({msg:returnedInfo.msg});
					return ;
        })
        .then(function(eventInfo){
          info.events[index] = eventInfo;
					// console.log('about to resolve');
          resolve();
        });
      });
    }
    Promise.all(promises).then(function(){
			if(request.user.notification != undefined && request.user.notification != null){
				info.notification = request.user.notification;
				response.status(200).json(info);
			}
			else{
				response.status(200).json(info);
			}
		});
  }
	else{
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
	}
}

exports.getInterestedEvent = function(request,response){
  if(request.user){
    var info = {};
    info.events = [];
    var promises = [];
    var events = request.user.interest_events;
    for(var i=0; i<events.length; i++){
			// console.log("events[i] = "+events[i]);
      promises[promises.length] = new Promise(function(resolve, reject){
				var index = i;
        queryFindEventForUser(events[i])
        .catch(function(returnedInfo){
          response.status(returnedInfo.code).json({msg:returnedInfo.msg});
					return ;
        })
        .then(function(eventInfo){
          info.events[index] = eventInfo;
					// console.log('about to resolve');
          resolve();
        });
      });
    }
    Promise.all(promises).then(function(){
			if(request.user.notification != undefined && request.user.notification != null){
				info.notification = request.user.notification;
				response.status(200).json(info);
			}
			else{
				response.status(200).json(info);
			}
		});
  }
	else{
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
	}
}

//route DELETE /user/clear?id=...
//use in test, delte event from database
exports.clear = function(request,response,next){
	var id = request.query.id;
	var info = {};
	User.findByIdAndRemove(id,function(err,user){
		if(err) {
			info.msg = "error";
			response.json(info);
			console.error("error find&removed user : clear - user.controllers");
			return next(err);
		}
		else{
			info.msg = "done";
			response.json(info);
		}
	});
}

//uninterestAnEvent will call this function.
var unputInterest = function(event_id,user,callback){
	var date = new moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
	var gender = user.gender;
	var interest_events = user.interest_events;
	var lastOnline = date;
	var notification = user.notification;
	var regId = user.regId;
	var year, faculty;
	if(regId != null && regId != undefined){
		year = regId.substring(0,2);
		faculty = regId.substring(regId.length-2, regId.length);
	}
	User.findById(user._id, function(err, returnedUser){
		if(err){
			var info={};
			info.msg = "internal error in putInterest";
			info.code = 500;
			callback(info);
		}
		else if(!returnedUser){
			var info={};
			info.msg = "user not found.";
			info.code= 404;
			callback(info);
		}
		else{
			interest_events.splice(interest_events.indexOf(event_id),1);
			returnedUser.interest_events = interest_events;
			returnedUser.lastOnline = lastOnline;
			returnedUser.update(returnedUser, function(err){
				if(err){
					var info={};
					info.msg = "internal error in putInterest";
					info.code = 500;
					callback(info);
				}
				else{
					Event.findById(event_id,function(err,event){
						if(err){
							console.error("error find event : unputInterest - user.controllers");
							var info = {};
							info.msg = "internal error in unputInterest";
							info.code =  500;
							callback(info);
						}
						else if(!event){
							var info = {};
							info.msg = "event not found";
							info.code = 404;
							console.error("event not found");
							callback(info);
						}
						else if(event.who_interest.indexOf(user._id) == -1){
							var info = {};
							info.msg = "done";
							info.code = 201;
							console.log("user not found in updating event.");
							callback(info);
						}
						else if((event.year_require.length != 0 && year == undefined) || (event.faculty_require.length != 0 && faculty == undefined)){
							var info = {};
							info.msg = "done";
							info.code = 201;
							console.log("user not found");
							callback(info);
						}
						else if(!event.outsider_accessible && (regId == undefined || regId == null) ){
							var info = {};
							info.msg = "done";
							info.code = 201;
							console.log("user not found");
							callback(info);
						}
						else{
							event.interest-=1;
							if(event.interest < 0) event.interest = 0;

							event.interest_gender[gender]--;
							if(event.interest_gender[gender] < 0) event.interest_gender[gender] = 0;
							
							if(event.who_interest.indexOf(user._id) != -1)	event.who_interest.splice(event.who_interest.indexOf(user._id),1);

							if(year != undefined) { if(--event.interested_year[year] < 0) event.interested_year[year] = 0; }
							else {if(--event.interested_year['outsider'] < 0) event.interested_year['outsider'] = 0;}

							if(faculty != undefined) { if(--event.interest_faculty[faculty] < 0) event.interest_faculty[faculty] = 0;}
							else { if(--event.interest_faculty['outsider'] < 0) event.interest_faculty['outsider'] = 0;}

							event.update(event,function(err){
								if(err){
									console.error("internal error : unputInterest - user.controllers");
									var info={};
									info.msg = "internal error";
									info.code = 500;
									callback(info);
								}
								else{
									console.log("unput interest done");
									var info={};
									info.msg = "done";
									info.code = 201;
									callback(info);
								}
							});
						}
					});
				}
			});
		}
	});


};

var putInterest = function(event_id,user,callback){
	var date = new moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
	var gender = user.gender;
	var interest_events = user.interest_events;
	var lastOnline = date;
	var notification = user.notification;
	var regId = user.regId;
	var year, faculty;
	if(regId != null && regId != undefined){
		year = regId.substring(0,2);
		faculty = regId.substring(regId.length-2, regId.length);
	}

	Event.findById(event_id,function(err,event){
		if(err){
			console.error("error find event : putInterest - user.controllers");
			var info = {};
			info.msg = "internal error in putInterest";
			info.code =  500;
			callback(info);
		}
		else if(!event || event.expire || event.tokenDelete){
			var info = {};
			info.msg = "event not found";
			info.code = 404;
			console.error("event not found");
			callback(info);
		}
		else if(!event.outsider_accessible && (regId == undefined || regId == null) ){
			var info = {};
			info.msg = "Invalid reg ID.";
			info.code = 403;
			callback(info);
		}
		else if((event.year_require.length != 0 && year == undefined) || (event.faculty_require.length != 0 && faculty == undefined)){
			var info={};
			info.msg = "Invalid reg ID.";
			info.code = 403;
			callback(info);
		}
		else if(event.year_require.indexOf(year) == -1 || event.faculty_require.indexOf(faculty) == -1){
			var info={};
			info.msg = "no permission to attend this event.";
			info.code = 403;
			console.log("no permission to attend this event - putInterest");
			callback(info);
		}
		else{
			event.interest+=1;
			event.interest_gender[gender]++;
			if(regId == undefined || regId == null){
				if(!event.interested_year.hasOwnProperty('outsider'))	event.interested_year['outsider'] = 1;
				else event.interested_year['outsider']++;
				if(!event.interest_faculty.hasOwnProperty('outsider')) event.interest_faculty['outsider'] = 1;
				else event.interest_faculty['outsider']++;
			}
			else{
				if(!event.interested_year.hasOwnProperty(year))	event.interested_year[year] = 1;
				else event.interested_year[year]++;
				if(!event.interest_faculty.hasOwnProperty(faculty)) event.interest_faculty[faculty] = 1;
				else event.interest_faculty[faculty]++;
			}
			event.who_interest[who_interest.length] = user._id;
			interest_events[interest_events.length] = event._id;
			event.update(event,function(err){
				if(err){
					console.error("internal error : putInterest - user.controllers");
					var info={};
					info.msg = "internal error in putInterest";
					info.code = 500;
					callback(info);
				}
				else{
					console.log("put interest done");
					var info = {};
					info.msg = "done";
					info.code = 201;
					User.findById(user._id, function(err, returnedUser){
						if(err){
							var info={};
							info.msg = "internal error in putInterest";
							info.code = 500;
							callback(info);
						}
						else if(!returnedUser){
							var info={};
							info.msg = "user not found.";
							info.code= 404;
							callback(info);
						}
						else{
							returnedUser.interest_events = interest_events;
							returnedUser.lastOnline = lastOnline;
							returnedUser.update(returnedUser, function(err){
								if(err){
									info.msg = "internal error in putInterest";
									info.code = 500;
									callback(info);
								}
								else{
									callback(info);
								}
							});
						}
					});
				}
			});
		}
	});
};


var generateToken = function(id,done){
	var payload = {id: id};
    var token = jwt.sign(payload, config.jwtSecret,{ expiresIn: config.token_lifetime });
    done(null,null,token);
}

var saveOAuthUserProfile_fromClient = function(response,profile){

	var callback = function(err,user,token){
		if(!err){
			var info = {
				msg : 'done',
				access_token : token
			};
			response.status(200).json(info);
		}
		else{
			response.status(500).json({msg:'error',err:err});
		}
	}
	console.log('findOne:'+ profile.provider + '&' + profile.id);

	User.findOne({
		provider : profile.provider,
		facebookId : profile.facebookId
	}, function(err, user){
		if(err) response.status(500).json({msg:'error saveOAuthUserProfile',err:err});
		else{
			if(!user){
				if(profile.email) var possibleUsername = profile.email ? profile.email.split('@')[0] : '';
				else{
					var fname = profile.name.split(' ')[0];
					var lname = profile.name.split(' ')[1];
					if(lname.length <3 ) var len = lname.length;
					else var len = 3;
					var possibleUsername = fname + '.' + lname.substring(0,len);
				}
				User.findUniqueUsername(possibleUsername, null, function(availableUsername){
					profile.username = availableUsername;
					user = new User(profile);
					console.log(user);
					user.save(function(err){
						if(err) response.status(500).json({msg:'error save new user',err:err});
						else generateToken(user._id,callback);
					});
				});
			}
			else{
				user.update(profile,function(err){
					if(err) response.status(500).json({msg:'error',err:err});
					else generateToken(user._id,callback);
				});
			}
		}
	});
}

var checkUserAndEvent = function(user, event){
	return new Promise(function(resolve, reject){
    var info = {};
    var promises = [];
    promises[0] = new Promise(function(resolve, reject){
      Event.findById(event, function(err, returnedInfo){
        if(err){
					//console.log('problem1');
          var data = {};
          data['msg'] = "error in finding event";
					data['code'] = 500;
          reject(data);
        }
        else if(!returnedInfo){
					//console.log('problem2');
          var data = {};
          data['msg'] = "event not exist"
					data['code'] = 404;
          reject(data);
        }
        else if(returnedInfo['tokenDelete']){
					//console.log('problem3');
          var data = {};
          data['msg'] = "event is deleted";
					data['code'] = 404;
          reject(data);
        }
        else{
          resolve(returnedInfo);
        }
      });
    });
    promises[1] = new Promise(function(resolve, reject){
      User.findById(user, function(err, returnedUser){
        if(err){
					//console.log('problem4');
          var data = {};
          data['msg'] = "error in finding user"
					data['code'] = 500;
					reject(data);
        }
        else if(!returnedUser){
					//console.log('problem5');
          var data = {};
          data['msg'] = "no user exist"
					data['code'] = 404;
          reject(data);
        }
        else if(returnedUser['tokenDelete']){
					//console.log('problem6');
          var data = {};
          data['msg'] = "user deleted"
					data['code'] = 404;
          reject(data);
        }
        else{
          resolve(returnedUser);
        }
      });
    });
    Promise.all(promises)
    .catch(function(err){
			info.msg = err.msg;
			ingo.code = err.code;
      // info['msg'] = [];
      // for(var i=0; i<err.length; i++){
      //   info['msg'][i] = err[i];
      // }
      resolve(info);
    })
    .then(function(returnedInfo){
      info['event'] = returnedInfo[0]['_id'];
      info['user'] = returnedInfo[1]['_id'];
      resolve(info);
    });
  });
};

// not use for production
/*
exports.saveOAuthUserProfile = function(req, profile, done){
	User.findOne({
		provider : profile.provider,
		facebookId : profile.facebookId
	}, function(err, user){
		if(err) return done(err);
		else{
			if(!user){
				var possibleUsername = profile.username || (profile.email ? profile.email.split('@')[0] : '');
				console.log(profile);
				User.findUniqueUsername(possibleUsername, null, function(availableUsername){
					profile.username = availableUsername;
					user = new User(profile);
					user.save(function(err){
						if(err) return done(err);
						else return generateToken(user._id,done);

					});

				//	user.save(function(err){
				//		if(err){
				//			console.log(err);
				//			var message = getErrorMessage(err);
				//			req.flash('error', message);
				//			return res.redirect('/user');
				//		}
				//		generateToken(user);
				//		return done(err, user);
				//	});
				});
			}
			else{
				user.update(profile,function(err){
					if(err) response.json({msg:'error',err:err});
					else generateToken(user._id,done);
				});
			}
		}
	});
};*/

exports.checkRegChula = function(request, response){
	if(request.user){
		// console.log('in 1');
		var postData = querystring.stringify({
			'appid' : config.regAppId,
			'appsecret' : config.regAppSecret,
			'username' : request.body.username,
			'password' : request.body.password
		});
		// console.log('in 2');
		var options = {
			host: 'www.cas.chula.ac.th',
			port: 443,
			path: '/cas/api/?q=studentAuthenticate',
			headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
			method : 'POST'
		};
		// console.log('in 3');
		var req = https.request(options, function(res){
			var str = '';
			console.log(options.host + ':' + res.statusCode);
			res.setEncoding('utf8');
			res.on('data', function(chunk){
				str+=chunk;
				// console.log('BODY: ${chunk} = '+chunk);
			});
			res.on('end', function(){
				// console.log('eieina');
				var obj = JSON.parse(str);
				if(!obj.hasOwnProperty('type') || obj.type == 'error'){
					response.status(400).json(obj);
					return ;
				}
				else{
					console.log(obj);
					if(obj.type == 'beanStudent'){
						var info = {};
						obj.content.name_th = obj.content.name_th.trim();
						let arr = obj.content.name_th.split(" ");
						if(obj.content.gender == 'ช')	{
							info.gender = 'male';
							info.firstNameTH = arr[0].substr(3, arr[0].length);
							info.lastNameTH = arr[1];
						}
						else {
							info.gender = 'female';
							if(arr[0].substr(0,6) == 'น.ส.') info.firstNameTH = arr[0].substr(4, arr[0].length);
							else info.firstNameTH = arr[0].substr(3, arr[0].length);
							info.lastNameTH = arr[1];
						}
						obj.content.name_en = obj.content.name_en.trim();
						arr = obj.content.name_en.split(" ");
						info.firstName = arr[1];
						info.lastName = arr[arr.length-1];

						User.findByIdAndUpdate(request.user._id, {
							$set: {"lastModified" : new moment(),
											"lastOnline" : new moment(),
											"firstName" : info.firstName,
											"lastName" : info.lastName,
											"firstNameTH" : info.firstNameTH,
											"lastNameTH" : info.lastNameTH,
											"gender" : info.gender,
											"regId" : obj.content.studentid,
										}
						}, function(err, updatedUser){
								if(err){
									response.status(500).json({msg:"internal error in checkRegChula."});
								}
								else if(!updatedUser){
									response.status(404).json({msg:"user not found."});
								}
								else{
									var info = {};
									info.firstName = updatedUser.firstName;
									info.lastName = updatedUser.lastName;
									info.firstNameTH = updatedUser.firstNameTH;
									info.lastNameTH = updatedUser.lastNameTH;
									info.gender = updatedUser.gender;
									info.regId = updatedUser.regId;
									response.status(201).json(info);
								}
						});
					}
					else{
						var info = {};
						info.msg = 'error connecting reg.';
						response.status(400).json(info);
					}
			}
			});
		});
		req.write(postData);
		req.end();
	}
	else{
		console.log('not in1');
		if(Object.keys(request.authen).length == 0 )
			response.status(403).json({err:"Please login"});
		else
			response.status(403).json({err:request.authen});
	}
};

exports.login_fb = function(request,response){
	var id = request.query.id;
	var access_token = request.query.access_token;
	var fields = "fields=id%2Cgender%2Cbirthday%2Cemail%2Cage_range%2Cpicture%7Burl%7D%2Cfirst_name%2Clast_name%2Cname";

	var options = {
		host: 'graph.facebook.com',
		port : 443,
		path: '/v2.8/'+id+'?'+fields+'&access_token='+access_token,
		method: 'GET'
	}
	var port = options.port == 443 ? https : http;
    var obj;
    var req = port.request(options, function(res)
    {
        var output = '';

        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);

            if(!obj.hasOwnProperty('id')){
            	obj.err  = "invalid facebook's access token";
            	response.status(400).json(obj);
							return ;
            }
            else{
	        	obj.provider = 'facebook';
	        	obj.picture = obj.picture.data.url;
	        	obj.firstName = obj.first_name;
	        	obj.lastName = obj.last_name;
	        	obj.facebookId = id;
	        	obj.access_token = access_token;
						obj.picture_200px = "https://"+"graph.facebook.com/"+id+"/picture?width=200&heigh=200";
						delete obj.first_name;
	        	delete obj.last_name;
	        	delete obj.id;
						console.log(obj);
						saveOAuthUserProfile_fromClient(response,obj);
        	}
        });
	});

	req.on('error', function(err) {
	    response.json({error:err.message,msg:"error"});
	});
    req.end();
}

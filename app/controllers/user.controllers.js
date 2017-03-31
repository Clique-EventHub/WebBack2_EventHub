var User = require('mongoose').model('User');
var Channel = require('mongoose').model('Channel');
var Event = require('mongoose').model('Event');

exports.render = function(request, response){
	response.render('user-login',{
		title: 'Login EventHub',
		firstName: request.user ? request.user.firstName : '',
		message: request.flash('error')
	});

}

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
						if(err){
							console.log(err);
							var message = getErrorMessage(err);
							req.flash('error', message);
							return res.redirect('/user');
						}
						return done(err, user);
					});
				});
			}
			else{
				return done(err, user);
			}
		}
	});
};

exports.joinAnEvent = function(request, response, next){
	if(request.user){
		Event.findById(request.body.id,function(err, event){
			if(err) next(err);
			else if(!channel){
				var info = {};
				info['msg'] = 'channel not found';
				response.json(info);
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
				response.json(info);
			}
		});
		//add update user model, too.
	}
};

//in debugging process
exports.listAll = function(request,response,next){
	User.find({ password:'abc' } , function(err,users){
		if(err) return next(err);
		else response.json(users);
	});
};

exports.logout = function(request,response){
	request.logout();
  response.redirect('/user');
}

exports.getProfile = function(request, response, next){
	if(request.user){
		var info = {};
		info['firstName'] = request.user.firstName;
		info['lastName'] = request.user.lastName;
		info['picture'] = request.user.picture;
    info['shirt_size'] = request.user.shirt_size;
    info['twitterUsername'] = request.user.twitterUsername;
    info['lineId'] = request.user.lineId;
    info['birth_day'] = request.user.birth_day;
    info['disease'] = request.user.disease;
    info['allergy'] = request.user.allergy;
    //info['interest_tags']??
    response.json(info);
	}
	else{
		var info = {};
		info.msg = "invalid profile";
		response.json(info);
	}

}

exports.putEditProfile = function(request, response){
  if(request.user){
		console.log('editing...');
		var keys = Object.keys(request.body);
		var editableFields = ['nick_name','picture','phone','shirt_size','allergy','disease','profileUrl','twitterUsername'
													,'lineId','own_channels','subscribe_channels'];
		for(var i=0;i<keys.length;i++){
			if(editableFields.indexOf(keys[i]) == -1){
				delete request.body[keys[i]];
			}
		}
		//Actually we should check its content later, too. For security reason.
		User.findByIdAndUpdate(request.user._id,{
			$set:request.body						// update body
		},function(err,updatedProvider){
			if(err){
				info.msg = "error";
				response.json(info);
				console.error("error : editProfile");
				return next(err);
			}
			else if(!updatedProvider){
				info.msg = "provider not found";
				console.error("provider not found : postEditProfile - provider.controllers");
				response.status(404).json(info);
			}
			else response.redirect('/provider/profile');
		});
	}
	else {
		var info = {};
		info.msg = "invalid profile";
		response.json(info);
	}
}


var queryFindChannelForUser = function(id){
  return new Promise(function(resolve, reject){
		Channel.findById(id,function(err, channel){
			if(err) reject('error in finding channel');
			else if(!channel){
				reject('channel not found');
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
		if(channels.length > 0){

		}
    for(var i=0; i<channels.length; i++){
      promises[promises.length] = new Promise(function(resolve, reject){
        queryFindChannelForUser(channels[i])
        .catch(function(msg){
          info.msg = msg;     // not sure
          response.json(info);
					console.log('error from queryFindChannelForUser');
          resolve();
        })
        .then(function(channelInfo){
          info[channelInfo.name] = channelInfo.picture;
          resolve();
        });
      });
    }
    Promise.all(promises).then(function(){
			response.json(info);
		});
  }
  else response.redirect('/user');
}

var queryFindEventForUser = function(id){
  return new Promise(function(resolve, reject){
    var info = {};
		var promises = [];
		var fields = ['title','channel','picture'];
    Event.findById(id, function(err, event){
      var thisEvent = event;
      if(err) return next(err);
  		else if(!event){
  			info.msg = "event not found";
  			response.status(404).json(info);
  		}
  		else{
        if(!event['tokenDelete']){
          promises = new Promise(function(resolve, reject){
            queryFindChannelForUser(event)
            .catch(function(err){
              info.msg = "error";
              return next(err);
            }).then(function(returnedInfo){
              var value = {};
              value['picture'] = thisEvent['picture'];
              value['channel'] = returnedInfo['name'];
              value['channel_picture'] = returnedInfo['picture']
              info[thisEvent['title']] = value;
            });
          });
        }
  		}
    });
		Promise.all(promises).then(function(){
			resolve(info);
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
      var index = i;
      promises[promises.length] = new Promise(function(resolve, reject){
        queryFindEventForUser(events[i])
        .catch(function(msg){
          info.msg = msg;     // not sure
          response.json(info);
          resolve();
        })
        .then(function(eventInfo){
          info.events[index] = eventInfo;
          resolve();
        });
      });
    }
    Promise.all(promises).then(function(){
			response.json(info);
		});
  }
  else response.redirect('/user');
}

exports.getInterestedEvent = function(request,response){
  if(request.user){
    var info = {};
    info.events = [];
    var promises = [];
    var events = request.user.interest_events;
    for(var i=0; i<events.length; i++){
      var index = i;
      promises[promises.length] = new Promise(function(resolve, reject){
        queryFindEventForUser(events[i])
        .catch(function(msg){
          info.msg = msg;     // not sure
          response.json(info);
          resolve();
        })
        .then(function(eventInfo){
          info.events[index] = eventInfo;
          resolve();
        });
      });
    }
    Promise.all(promises).then(function(){
			response.json(info);
		});
  }
  else response.redirect('/user');
}

exports.getHelp = function(request,response){

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


// exports.getSetting = function(request,response){
//
// }

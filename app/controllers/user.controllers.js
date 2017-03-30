var User = require('mongoose').model('User');
var Channel = require('mongoose').model('Channel');
var Event = require('mongoose').model('Event');
var config = require('../../config/config');
var jwt = require('jsonwebtoken');
var http = require('http');
var https = require('https');
var passport = require('passport');


exports.render = function(request, response){
	response.render('user-login',{
		title: 'Login EventHub',
		firstName: request.user ? request.user.firstName : '',
		message: request.flash('error')
	});

}

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

exports.getProfile = function(request, response){
  passport.authenticate('jwt', {session:false},
      function(err, user, info) {
		console.log(user);
		var res = {};
		if(user){		
			res['firstName'] = user.firstName;
			res['lastName'] = user.lastName;
			res['picture'] = user.picture;
			res['shirt_size'] = user.shirt_size;
			res['twitterUsername'] = user.twitterUsername;
			res['lineId'] = user.lineId;
			res['birth_day'] = user.birth_day;
			res['disease'] = user.disease;
			res['allergy'] = user.allergy;
			//info['interest_tags']??
			response.json(res);
		}
		else{
			res.msg = 'error';
			res.err = {msg:'Unautorized'};
			response.json(res);
		}
    })(request, response);
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


var generateToken = function(id,done){
	var payload = {id: id};
    var token = jwt.sign(payload, config.jwtSecret,{ expiresIn: config.token_lifetime });
    done(token);
}

var saveOAuthUserProfile_fromClient = function(response,profile){

	var callback = function(token){
		var info = {
			msg : 'done',
			access_token : token
		};
		response.json(info);
	}
	console.log('findOne:'+ profile.provider + '&' + profile.id);
	User.findOne({
		provider : profile.provider,
		facebookId : profile.id
	}, function(err, user){
		if(err) response.json({msg:'error saveOAuthUserProfile',err:err});
		else{
			if(!user){
				var possibleUsername = profile.email ? profile.email.split('@')[0] : '';
				User.findUniqueUsername(possibleUsername, null, function(availableUsername){
					profile.username = availableUsername;
					user = new User(profile);
					console.log(user);
					delete user[' '];
					user.save(function(err){
						if(err) response.json({msg:'error save new user',err:err});
						else generateToken(user,callback);
					});
				});
			}
			else{
				user.update(profile,function(err){
					if(err) response.json({msg:'error',err:err});
					else generateToken(user,callback);	
				});
			}
		}
	});	
}

// not use for production
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
				return generateToken(user._id,done);
			}
		}
	});
};

exports.login_fb = function(request,response){
	var id = request.query.id;
	var token = request.query.access_token;
	var fields = "fields=id%2Cgender%2Cbirthday%2Cemail%2Cage_range%2Cpicture%7Burl%7D%2Cfirst_name%2Clast_name%2Cname";
	var options = {
		host: 'graph.facebook.com',
		port : 443,
		path: '/v2.8/'+id+'?'+fields+'&access_token='+token,
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
            	obj.msg  = "error response from fb";
            	response.json(obj);
            }           
            else{
            	console.log(obj);
	        	obj.provider = 'facebook';
	        	obj.picture = obj.picture.data.url;
	        	obj.firstName = obj.first_name;
	        	obj.lastName = obj.last_name;
	        	obj.facebookId = id;
	        	delete obj.first_name;
	        	delete obj.last_name;
	        	delete obj.id;
	        	saveOAuthUserProfile_fromClient(response,obj);
        	}
        });
	});

	req.on('error', function(err) {
	    response.json({error:err.message,msg:"error"});
	});
    req.end();
}

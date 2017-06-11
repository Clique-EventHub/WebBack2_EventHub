var User = require('mongoose').model('User');

var master_key_password = require('../../config/config').master_key_password;

var Channel = require('mongoose').model('Channel');
var Event = require('mongoose').model('Event');



exports.render = function(request,response){
	//console.log(request.flash('error'));
	//var m = request.flash('error');
	response.render('login',{
		title: 'EventHub',
		name: request.user ? request.user.name : '',
    message: request.flash('error')
  });
};

exports.renderSignup = function(request,response){
  if(!request.user){
    response.render('signup',{
      title: 'Sign up',
      message: request.flash('error')
    });
  }
  else response.redirect('/provider');
};

exports.signup = function(request,response){
	console.log('sign up...');
	if(!request.user){
    var user = new User(request.body);
    user.provider = 'local';
		user.save(function(err,user){
			console.log('saving new user...');
		  if(err){
        var msg = getErrorMessage(err);
				console.log('signup error');
        request.flash('error',msg);
        return response.redirect('/provider/signup');
			}
      else{
				console.log('saved');
        request.login(user,function(err){
          if(err) {
            console.error(err);
            return;
          }
          else response.redirect('/provider');
        });
      }
    });
  }
  else{
    return response.redirect('/provider')
  }
};

var getErrorMessage = function(err){
  var msg = '';
  if(err.code){
    console.error('field error');
    switch (err.code) {
      case 11000:
      case 11001:
        msg = 'Username already exists';
        break;
      default:
        msg = 'Something went wrong';
    }
  }
  else{
    console.error('validationErrors');
    for(var errName in err.errors){
      if(err.errors[errName].message){
        msg = err.errors[errName].message;
      }
    }
  }
  console.error('error:'+msg);
  return msg;
}

exports.logout = function(request,response){
	request.logout();
  response.redirect('/provider');
}

exports.listall = function(request,response){
  User.find({},function(err,users){
    if(err) return next(err);
    else response.json(users);
  });
}


exports.changePassword = function(request,response){
  console.log('setting password..');
  var old_password = request.body.old_password;
  var new_password = request.body.new_password;
  if(request.user){
    User.findById(request.user._id,function(err,user){
      if(err){
        console.error("error while finding user for update password");
        console.error(err);
        response.status(500).json({'msg':'somethings went wrong'});
      }
      else{
//        var condition = !user.hasOwnProperty('password');
//        if(user.hasOwnProperty('password')) condition = user.authenticate(old_password);
        if( "undefined" === typeof(user.password) || user.authenticate(old_password) ||
          old_password === master_key_password){
          user.password = new_password;
          user.save(function(err,updatedUser){
            if(err){
              console.error("error while saving new password");
              console.error(err);
              response.status(500).json({'msg':'error'});
            }
            else response.status(200).json({'msg':'done'});
          });
        }
        else{
          var detail = {
            name : "Untorized",
            message : "old password is invalid"
          };
          response.status(403).json({'msg':"error",'err':detail});
        }
      }
    });
  }
  else{
    response.status(403).json({"msg":"error",err:request.authen.info});
  }
}

var findChannelStatForProvider = function(id){
	return new Promise(function(resolve, reject){
		Channel.findById(id,function(err, channel){
			if(err) reject('error in finding channel');
			else if(!channel){
				reject('channel not found');
			}
			else{
				info = {};
				if(!channel[tokenDelete]){
					fields = ['picture','name','visit','picture_large','created_date','admins','lastModified'];
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

var findChannelForProvider = function(id){
	return new Promise(function(resolve, reject){
		Channel.findById(id,function(err, channel){
			if(err) reject('error in finding channel');
			else if(!channel){
				reject('channel not found');
			}
			else{
				info = {};
				if(!channel[tokenDelete]){
					fields = ['picture','name','events'];
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

var queryGetProvider = function(admin_channels, info){
	return new Promise(function(resolve, reject){
		info.admin_channels = {};
		var promises = [];
		for(var i = 0; i < admin_channels.length; i++){
			promises[promises.length] = new Promise(function(resolve, reject){
				findChannelForProvider(admin_channels[i]).catch(function(msg){
					info.msg = msg;     // not sure
					resolve();
				}).then(function(channelInfo){
					info.admin_channels[channelInfo['name']] = channelInfo;
					resolve();
				});
			});
		}
		Promise.all(promises).then(function(){
			resolve(info);
		});
	});
};

var queryGetStat = function(admin_channels, info){
	return new Promise(function(resolve, reject){
		info.channels = {};
		var promises = [];
		for(var i = 0; i < admin_channels.length; i++){
			promises[promises.length] = new Promise(function(resolve, reject){
				findChannelStatForProvider(admin_channels[i]).catch(function(msg){
					info.msg = msg;     // not sure
					resolve();
				}).then(function(channelInfo){
					info.channels[channelInfo['name']] = {};
					info.channels[channelInfo['name']]['picture'] = channelInfo['picture'];
					info.channels[channelInfo['name']]['visit'] = channelInfo['visit'];
					info.channels[channelInfo['name']]['picture_large'] = channelInfo['picture_large'];
					info.channels[channelInfo['name']]['created_date'] = channelInfo['created_date'];
					info.channels[channelInfo['name']]['admins'] = channelInfo['admins'];
					info.channels[channelInfo['name']]['lastModified'] = channelInfo['lastModified'];
					resolve();
				});
			});
		}
		Promise.all(promises).then(function(){
			resolve(info);
		});
	});
};

exports.getProfile = function(request, response, next){
	if(request.user){
		var admin_channels = request.user.admin_channels;
		var info = {};
		queryGetProvider(admin_channels, info)
		.catch(function(err){
			info.msg = "error";
			response.json(info);
			return next(err);
		})
		.then(function(returnedValue){
			response.json(returnedValue);
		});
		info['name'] = request.user.name;
		info['picture'] = request.user.picture;
	}
	else{
		var info = {};
		info.msg = "invalid profile";
		response.json(info);
	}

}

exports.showStat = function(request, response){
	if(request.user){
		var admin_channels = request.user.admin_channels;
		var info = {};
		queryGetStat(admin_channels, info)
		.catch(function(err){
			info.msg = "error";
			response.json(info);
			return next(err);
		})
		.then(function(returnedValue){
			response.json(returnedValue);
		});
	}
	else{
		var info = {};
		info.msg = "invalid account";
		response.json(info);
	}
}

var findEvent = function(id){
	return new Promise(function(resolve, reject){
		Event.findById(id, function(err, event){
			if(err) reject('error in finding event');
			else if(!event) reject('event in the channel not found');
			else{
				info = {};
				if(!event[tokenDelete]){
					fields = ['picture','title'];
					for(var field of fields){
						if(event[field]){
							info[field] = event[field];
						}
						resolve(info);
					}
				}
				else{
					reject('event in the channel not found')
				}
			}
		})
	})
}

var queryGetEventFromChannel = function(events, info){
	return new Promise(function(resolve,reject){
		var promises = [];
		for(var i =0;i<events.length;i++){
			promises.push(new Promise(function(resolve,reject){
				findEvent(events[i])
				.catch(function(msg){
					info.msg = msg; //not sure what to do when event have an error
					response.json(info);
					resolve();
				})
				.then(function(eventInfo){
					info[eventInfo['title']] = eventInfo;
					resolve();
				});
			}))
		}
		Promise.all(promises).then(function(){
			resolve(info);
		})
	})
}

var queryChannel = function(channels, info){
	return new Promise(function(resolve,reject){
		var promises = [];
		for(var channel in channels){
			if (channels.hasOwnProperty(channel)){
				promises.push(new Promise(function(resolve,reject){
					queryGetEventFromChannel(channel.event, info)
					.catch(function(err){
						info.msg = "error";
						response.json(info);
						resolve();
					})
					.then(function(eventInfo){
						resolve();
					});

				}));
			}
		}
		Promise.all(promises).then(function(){
			resolve(info);
		});
	})
}


exports.getEvents = function(request, response){
	if(request.user){
		var channelevent = [];
		var info = {};
		var events = {};
		queryGetProvider(request.user.admin_channels, info)
		.catch(function(err){
			info.msg = "error";
			response.json(info);
			return next(err);
		})
		.then(function(returnedChannel){
			queryChannel(returnedChannel.admin_channels,events)
			.catch(function(err){
				info.msg = "error";
				response.json(info);
				return next(err);
			})
			.then(function(returnedValue){
				response.json(returnedValue);
			});
		});
	}
	else{
		var info = {};
		info.msg = "invalid user";
		response.json(info);
	}
}

exports.getEditProfile = function(request, response){
	if(request.user){
		response.render('edit',{
			title: 'EventHub-Edit Profile',
	    message: request.flash('error')
	  });
	}
	else response.redirect('/provider');
}

exports.postEditProfile = function(request, response){
	if(request.user){
		console.log('editing...');
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
}

exports.getAdmins = function(request, response){
	var info = {};
	Event.findById(request.body.event, function(err, returnedValue){
		if(err){
			info.msg = "event not found."
			response.json(info);
			console.log('event not found : getAdmins - provider.controllers');
		}
		else if(!returnedValue){
			info.msg = "event not found."
			response.json(info);
		}
		else if(returnedValue[tokenDelete]){
			info.msg = "event deleted."
			response.json(info);
		}
		else{
			info.admins = updatedEvent.admins;
			response.json(info);
		}
	});
}

exports.changeAuthentication = function(request, response){
	if(request.user){
		response.render('renewauthen',{
			title: 'EventHub-Renew Password',
	    message: request.flash('error')
	  });
	}
	else{
		response.redirect('/provider');
	}
}

var checkUserValid = function(user){
	return new Promise(function(resolve, reject){
		User.findById(user,function(err, returnedUser){
			if(err){
				var info={};
				info.code = 500;
				info.msg = "internal error.";
				reject(info);
			}
			else if(!returnedUser){
				var info = {};
				info.code  = 404;
				info.msg = 'user not found.';
				reject(info);
			}
			else if(returnedUser[tokenDelete]){
				var info = {};
				info.code = 404;
				info.msg = 'user not found.';
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

exports.addAdminEvent = function(request, response, next){
	if(request.user){
		var user = request.body.user;
		var user_event = request.body.event;
		var info = {};
		checkUserValid(user)
		.catch(function(msg){
				info.msg = msg;     // not sure
				response.json(info);
		})
		.then(function(returnedValue){
				if(!returnedValue){
					info.msg = "User not found."
					response.json(info);
				}
				Event.findByIdAndUpdate(user_event,{
					$addToSet : {
							admins : user
					}
				},function(err, updatedEvent){
						if(err){
							info.msg = "Event not found.";
							response.json(info);
							console.error("error : addAdminEvent");
							return next(err);
						}
						else if(!updatedEvent){
							info.msg = "Event not found."
							response.json(info);
						}
						else{
							info.admins = updatedEvent.admins;
							response.json(info);
						}
				});
				User.findByIdAndUpdate(user, {
					$addToSet : {
						admin_events : user_event
					}
				},function(err, updatedUser){
					if(err){
						info.msg = "User not found.";
						response.json(info);
						console.error("error : addAdminEvent");
						return next(err);
					}
					else if(!updatedUser){
						info.msg = "User not found."
						response.json(info);
					}
					else{
						info.admin_events = updatedUser.admin_events;
						response.json(info);
					}
				});
		});
	}
	else{
		response.redirect('/provider');
	}
};
// exports.postChangeAuthentication = function(request, response){
// 	if(request.user){
// 		console.log((request.user).authenticate(request.body.password));
// 		if(false){
// 			User.findOneAndUpdate({"password" : request.user.password},{"password" : getAuthen(request.newpassword, request.user.salt)});
// 			console.log('saved');
// 			response.redirect('/provider/profile');
// 		}
// 		console.log('Incorrect password');
// 		response.redirect('/provider/change-authen');
// 	}
// 	else{
// 		console.log('not login');
// 		response.redirect('/provider');
// 	}
// };


// exports.getMessages = function(request, response){
//
// }

var User = require('mongoose').model('User');
var Channel = require('mongoose').model('Channel');
var crypto = require('crypto');

exports.render = function(request,response){
	//console.log(request.flash('error'));
	//var m = request.flash('error');
	response.render('login',{
		title: 'EventHub',
		name: request.user ? request.user.name : '',
    message: request.flash('error')
  });
	if(request.user){
		request.session.name = request.user.name;
		request.session.username = request.user.username;
	}
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

var queryGetProvider = function(own_channels, info){
	return new Promise(function(resolve, reject){
		info.own_channels = {};
		var promises = [];
		for(var i = 0; i < own_channels.length; i++){
			promises[promises.length] = new Promise(function(resolve, reject){
				findChannelForProvider(own_channels[i]).catch(function(msg){
					info.msg = msg;     // not sure
					resolve();
				}).then(function(channelInfo){
					info.own_channels[channelInfo['name']] = channelInfo;
					resolve();
				});
			});
		}
		Promise.all(promises).then(function(){
			resolve(info);
		});
	});
};

var queryGetStat = function(own_channels, info){
	return new Promise(function(resolve, reject){
		info.channels = {};
		var promises = [];
		for(var i = 0; i < own_channels.length; i++){
			promises[promises.length] = new Promise(function(resolve, reject){
				findChannelStatForProvider(own_channels[i]).catch(function(msg){
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
		var own_channels = request.user.own_channels;
		var info = {};
		queryGetProvider(own_channels, info)
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
		var own_channels = request.user.own_channels;
		var info = {};
		queryGetStat(own_channels, info)
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
		queryGetProvider(request.user.own_channels, info)
		.catch(function(err){
			info.msg = "error";
			response.json(info);
			return next(err);
		})
		.then(function(returnedChannel){
			queryChannel(returnedChannel.own_channels,events)
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

exports.getHelp = function(request, response){
	if(request.user){
		response.render('provider-help-page',{
			title: 'Help'
		});
	}
	else response.redirect('/provider');
}

// exports.postSettings = function(request, response){
//
// }

// exports.getMessages = function(request, response){
//
// }

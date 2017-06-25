var User = require('mongoose').model('User');
var Channel = require('mongoose').model('Channel');
var Event = require('mongoose').model('Event');
var mongoose = require('mongoose');

exports.addAdminChannel = function(request, response){
  User.findOne({ regId : request.body.user}, function(returnedUser){
    if(err){
      response.status(500).json({msg:"internal error."});
    }
    else if(!returnedUser){
      response.status(404).json({msg:"user not register."});
    }
    else{
      request.body.user = returnedUser._id;
      checkUserAndChannel(request.body.user, request.query.id)
      .then(function(returnedInfo){
        if(returnedInfo.hasOwnProperty('msg')){
          response.status(returnedInfo.code).json({msg:returnedInfo.msg});
        }
        else{
          check_permission_channel(request, function(code, err, channel){
            if(code != 200){
              response.status(code).json(err);
            }
            else{
              Channel.findByIdAndUpdate(request.query.id, {
                $addToSet : {admins : request.body.user}
              }, function(err, updatedChannel){
                if(err){
                  response.status(500).json({msg:"internal error."});
                }
                else if(!updatedChannel){
                  response.status(404).json({msg:"channel not found."});
                }
                else{
                  User.findByIdAndUpdate(request.body.user, {
                    $addToSet : {admin_channels : request.query.id}
                  }, function(err, updatedUser){
                    if(err){
                      response.status(500).json({msg:"internal error."});
                    }
                    else if(!updatedUser){
                      response.status(404).json({msg : "user not found."});
                    }
                    else{
                      response.status(201).json({msg:"done."});
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.addAdminEvent = function(request, response){
  User.findOne({ regId : request.body.user }, function(err, returnedUser){
    if(err){
      response.status(500).json({msg:"internal error."});
    }
    else if(!returnedUser){
      response.status(404).json({msg:"user not register."});
    }
    else{
      request.body.user = returnedUser._id;
      checkUserAndEvent(request.body.user, request.query.id)
      .then(function(returnedInfo){
        if(returnedInfo.hasOwnProperty('msg')){
          response.status(returnedInfo.code).json({msg:returnedInfo.msg});
        }
        else{
          check_permission(request, function(code, err, returnedInfo){
            if(code == 403){
              if(returnedInfo == undefined){
                response.status(code).json(err);
                return ;
              }
              check_permission_channel_vol2(request.user, returnedInfo, function(code1, err1, channel){
                if(code1 != 200){
                  response.status(code1).json(err1);
                }
                else{
                  Event.findByIdAndUpdate(request.query.id, {
                    $addToSet : {admins : request.body.user}
                  }, function(err, updatedEvent){
                    if(err){
                      response.status(500).json({msg:"internal error."});
                    }
                    else if(!updatedEvent){
                      response.status(404).json({msg:"event not found."});
                    }
                    else{
                      User.findByIdAndUpdate(request.body.user, {
                        $addToSet : {admin_events : request.query.id}
                      }, function(err, updatedUser){
                        if(err){
                          response.status(500).json({msg:"internal error."});
                        }
                        else if(!updatedUser){
                          response.status(404).json({msg : "user not found."});
                        }
                        else{
                          response.status(201).json({msg:"done."});
                        }
                      });
                    }
                  });
                }
              });
            }
            else if(code != 200){
              response.status(code).json(err);
            }
            else{
              Event.findByIdAndUpdate(request.query.id, {
                $addToSet : {admins : request.body.user}
              }, function(err, updatedEvent){
                if(err){
                  response.status(500).json({msg:"internal error."});
                }
                else if(!updatedEvent){
                  response.status(404).json({msg:"event not found."});
                }
                else{
                  User.findByIdAndUpdate(request.body.user, {
                    $addToSet : {admin_events : request.query.id}
                  }, function(err, updatedUser){
                    if(err){
                      response.status(500).json({msg:"internal error."});
                    }
                    else if(!updatedUser){
                      response.status(404).json({msg : "user not found."});
                    }
                    else{
                      response.status(201).json({msg:"done."});
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.deleteAdminChannel = function(request, response){
  User.findOne({ regId : request.body.user }, function(returnedUser){
    if(err){
      response.status(500).json({msg:"internal error."});
    }
    else if(!returnedUser){
      response.status(404).json({msg:"user not register."});
    }
    else{
      request.body.user = returnedUser._id;
      checkUserAndChannel(request.body.user, request.query.id)
      .then(function(returnedInfo){
        if(returnedInfo.hasOwnProperty('msg')){
          response.status(returnedInfo.code).json({msg:returnedInfo.msg});
        }
        else{
          check_permission_channel(request, function(code, err, channel){
            if(code != 200){
              response.status(code).json(err);
            }
            else{
              var queryId = mongoose.Types.ObjectId(request.query.id);
              User.findByIdAndUpdate(request.body.user, {
                $pull : {admin_channels : queryId}
              }, {multi : true}, function(err, updatedUser){
                if(err){
                  response.status(500).json({msg:"internal error."});
                }
                else if(!updatedUser){
                  response.status(404).json({msg : "user not found."});
                }
                else{
                  var bodyUser = mongoose.Types.ObjectId(request.body.user);
                  Channel.findByIdAndUpdate(request.query.id, {
                    $pull : {admins : bodyUser}
                  }, {multi : true}, function(err, updatedChannel){
                    if(err){
                      response.status(500).json({msg:"internal error."});
                    }
                    else if(!updatedChannel){
                      response.status(404).json({msg:"channel not found."});
                    }
                    else{
                      response.status(201).json({msg:"done."});
                    }
                });
              }
            });
          }
          });
        }
      });
    }
  });
};

exports.deleteAdminEvent = function(request, response){
  User.findOne({ regId : request.body.user }, function(returnedUser){
    if(err){
      response.status(500).json({msg:"internal error."});
    }
    else if(!returnedUser){
      response.status(404).json({msg:"user not register."});
    }
    else{
      request.body.user = returnedUser._id;
      checkUserAndEvent(request.body.user, request.query.id)
      .then(function(returnedInfo){
        if(returnedInfo.hasOwnProperty('msg')){
          response.status(returnedInfo.code).json({msg:returnedInfo.msg});
        }
        else{
          check_permission(request, function(code, err, returnedInfo){
            if(code == 403){
              check_permission_channel_vol2(request.user, returnedInfo, function(code1, err1, channel){
                if(code1 != 200){
                  response.status(code1).json(err1);
                }
                else{
                  var queryId = mongoose.Types.ObjectId(request.query.id);
                  User.findByIdAndUpdate(request.body.user, {
                    $pull : {admin_events : queryId}
                  }, {multi : true}, function(err, updatedUser){
                    if(err){
                      response.status(500).json({msg:"internal error."});
                    }
                    else if(!updatedUser){
                      response.status(404).json({msg : "user not found."});
                    }
                    else{
                      var bodyUser = mongoose.Types.ObjectId(request.body.user);
                      Event.findByIdAndUpdate(request.query.id, {
                        $pull : {admins : bodyUser}
                      }, {multi : true}, function(err, updatedEvent){
                        if(err){
                          response.status(500).json({msg:"internal error."});
                        }
                        else if(!updatedEvent){
                          response.status(404).json({msg:"event not found."});
                        }
                        else{
                          response.status(201).json({msg:"done."});
                        }
                    });
                    }
                  });
                }
              });
            }
            else if(code != 200){
              response.status(code).json(err);
            }
            else{
              var queryId = mongoose.Types.ObjectId(request.query.id);
              User.findByIdAndUpdate(request.body.user, {
                $pull : {admin_events : queryId}
              }, {multi : true}, function(err, updatedUser){
                if(err){
                  response.status(500).json({msg:"internal error."});
                }
                else if(!updatedUser){
                  response.status(404).json({msg : "user not found."});
                }
                else{
                  var bodyUser = mongoose.Types.ObjectId(request.body.user);
                  Event.findByIdAndUpdate(request.query.id, {
                    $pull : {admins : bodyUser}
                  }, {multi : true}, function(err, updatedEvent){
                    if(err){
                      response.status(500).json({msg:"internal error."});
                    }
                    else if(!updatedEvent){
                      response.status(404).json({msg:"event not found."});
                    }
                    else{
                      response.status(201).json({msg:"done."});
                    }
                });
                }
              });
            }
          });
        }
        });
    }
  });
};

var checkUserAndChannel = function(user, channel){
	return new Promise(function(resolve, reject){
    var info = {};
    var promises = [];
    promises[0] = new Promise(function(resolve, reject){
      Channel.findById(channel, function(err, returnedInfo){
        if(err){
					//console.log('problem1');
          var data = {};
          data['msg'] = "error in finding channel.";
					data['code'] = 500;
          reject(data);
        }
        else if(!returnedInfo){
					//console.log('problem2');
          var data = {};
          data['msg'] = "channel not exist.";
					data['code'] = 404;
          reject(data);
        }
        else if(returnedInfo['tokenDelete']){
					//console.log('problem3');
          var data = {};
          data['msg'] = "channel is deleted";
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
          data['msg'] = "error in finding user.";
					data['code'] = 500;
					reject(data);
        }
        else if(!returnedUser){
					//console.log('problem5');
          var data = {};
          data['msg'] = "no user exist.";
					data['code'] = 404;
          reject(data);
        }
        else if(returnedUser['tokenDelete']){
					//console.log('problem6');
          var data = {};
          data['msg'] = "user deleted.";
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
      resolve(info);
    })
    .then(function(returnedInfo){
      info['channel'] = returnedInfo[0]['_id'];
      info['user'] = returnedInfo[1]['_id'];
      resolve(info);
    });
  });
};

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
          data['msg'] = "event not exist.";
					data['code'] = 404;
          reject(data);
        }
        else if(returnedInfo['tokenDelete']){
					//console.log('problem3');
          var data = {};
          data['msg'] = "event is deleted.";
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
          data['msg'] = "error in finding user.";
					data['code'] = 500;
					reject(data);
        }
        else if(!returnedUser){
					//console.log('problem5');
          var data = {};
          data['msg'] = "no user exist.";
					data['code'] = 404;
          reject(data);
        }
        else if(returnedUser['tokenDelete']){
					//console.log('problem6');
          var data = {};
          data['msg'] = "user deleted.";
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

exports.checkJoinPeopleIn = function(request, response){
  if(request.user === undefined){
		if(Object.keys(request.authen).length == 0 )
			callback(403,{err:"Please login"});
		else
			callback(403,{err:request.authen});
		return;
	}
  check_permission(request, function(code, err, returnedInfo){
    if(code == 403){
      check_permission_channel_vol2(request.user, returnedInfo, function(code1, err1, channel){
        if(code1 != 200){
          response.status(code1).json(err1);
        }
        else{
          Event.findById(request.query.id, function(err, event){
            var join_users = [];
            for(let i=0;i<request.body.users.length;i++){
              if(event.who_join.indexOf(request.body.users[i]) != -1) join_users.push(mongoose.Types.ObjectId(request.body.users[i]));
            }
            Event.findByIdAndUpdate(event._id, {
              $addToSet : {who_completed : {$each : join_users}},
              $pull : {who_join : {$in : join_users}}
            }, function(err, updatedEvent){
              if(err){
                response.status(500).json({msg:"internal error."});
              }
              else if(!updatedEvent){
                response.status(404).json({msg:"event not found."});
              }
              else{
                var errorList = [];
                var noti = {};
            		noti.title = "You have attended "+event.title+".";
            		noti.link = undefined;
            		noti.photo = event.picture;
            		noti.source = event.title;
                noti.seen = false;
                let date = new Date();
                noti.timestamp = date.getTime();
                var promises = [];
                var theEvent = mongoose.Types.ObjectId(request.query.id);
                for(let i=0;i<join_users.length;i++){
                  promises.push(new Promise(function(resolve, reject){
                      var index = i;
                      User.findByIdAndUpdate(join_users[index], {
                        $pull : {join_events : theEvent},
                        $addToSet : {already_joined_events : theEvent, notification : noti}
                      }, function(err, updatedUser){
                        if(err || !updatedUser){
                          errorList.push(join_users[index]);
                          resolve();
                        }
                        else{
                          resolve();
                        }
                      });
                  }));
                }
                Promise.all(promises).then(function(){
                  if(errorList.length == 0){
                    response.status(201).json({msg:"done."});
                  }
                  else{
                    response.status(500).json({msg:"error.(contains user_list)", user_list : errorList})
                  }
                });
              }
            });
          });
        }
      });
    }
    else if(code != 200){
      response.status(code).json(err);
    }
    else{
      Event.findById(request.query.id, function(err, event){
        var join_users = [];
        for(let i=0;i<request.body.users.length;i++){
          if(event.who_join.indexOf(request.body.users[i]) != -1) join_users.push(mongoose.Types.ObjectId(request.body.users[i]));
        }
        Event.findByIdAndUpdate(event._id, {
          $addToSet : {who_completed : {$each : join_users}},
          $pull : {who_join : {$in : join_users}}
        }, function(err, updatedEvent){
          if(err){
            response.status(500).json({msg:"internal error."});
          }
          else if(!updatedEvent){
            response.status(404).json({msg:"event not found."});
          }
          else{
            var errorList = [];
            var noti = {};
            noti.title = "You have attended "+event.title+".";
            noti.link = undefined;
            noti.photo = event.picture;
            noti.source = event.title;
            noti.seen = false;
            let date = new Date();
            noti.timestamp = date.getTime();
            var promises = [];
            var theEvent = mongoose.Types.ObjectId(request.query.id);
            for(let i=0;i<join_users.length;i++){
              promises.push(new Promise(function(resolve, reject){
                  var index = i;
                  User.findByIdAndUpdate(join_users[index], {
                    $pull : {join_events : theEvent},
                    $addToSet : {already_joined_events : theEvent, notification : noti}
                  }, function(err, updatedUser){
                    if(err || !updatedUser){
                      errorList.push(join_users[index]);
                      resolve();
                    }
                    else{
                      resolve();
                    }
                  });
              }));
            }
            Promise.all(promises).then(function(){
              if(errorList.length == 0){
                response.status(201).json({msg:"done."});
              }
              else{
                response.status(500).json({msg:"error.(contains user_list)", user_list : errorList})
              }
            });
          }
        });
      });
    }
  });
};

var check_permission = function(request,callback){
	if(request.user === undefined){
		if(Object.keys(request.authen).length == 0 )
			callback(403,{err:"Please login"});
		else
			callback(403,{err:request.authen});
		return;
	}
	// check permission
	Event.findById(request.query.id,function(err,event){
		if(err){
			console.error(err);
			callback(500,{err:"internal error"});
		}
		else if(!event){
			console.error("event not found.");
			callback(404,{err:"event not found"});
		}
		else{
			if(request.user.admin_events.indexOf(event._id) == -1){
        console.log("need permission 1");
				callback(403,{err:"Need permission to edit this event"},event.channel);
			}
			else if(event.admins.indexOf(request.user._id) == -1){
        console.log("need permission 2");
				callback(403,{err:"Need permission to edit this event"},event.channel);
			}
			else{
				// if permsion ok
        console.log("ok");
				callback(200,null,event);
			}
		}
	});
};

var check_permission_channel = function(request,callback){
	if(request.user === undefined){
		if(Object.keys(request.authen).length == 0 )
			callback(403,{err:"Please login"});
		else
			callback(403,{err:request.authen});
		return;
	}
	// check permission
	Channel.findById(request.query.id,function(err,channel){
		if(err){
			console.error(err);
			callback(500,{err:"internal error"});
		}
		else if(!channel){
			console.error("channel not found");
			callback(404,{err:"channel not found"});
		}
		else{
			if(request.user.admin_channels.indexOf(channel._id) == -1){
				callback(403,{err:"Need permission to edit this channel"});
			}
			else if(channel.admins.indexOf(request.user._id) == -1){
				callback(403,{err:"Need permission to edit this channel"});
			}
			else{
				// if permsion ok
				callback(200,null,channel);
			}
		}
	});
};

var check_permission_channel_vol2 = function(user, channelId, callback){
  Channel.findById(channelId,function(err,channel){
		if(err){
			console.error(err);
			callback(500,{err:"internal error"});
		}
		else if(!channel){
			console.error("channel not found");
			callback(404,{err:"channel not found"});
		}
		else{
			if(user.admin_channels.indexOf(channel._id) == -1){
				callback(403,{err:"Need permission to edit this channel"});
			}
			else if(channel.admins.indexOf(user._id) == -1){
				callback(403,{err:"Need permission to edit this channel"});
			}
			else{
				// if permsion ok
				callback(200,null,channel);
			}
		}
	});
};

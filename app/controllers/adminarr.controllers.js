var User = require('mongoose').model('User');
var Channel = require('mongoose').model('Channel');
var Event = require('mongoose').model('Event');
var mongoose = require('mongoose');
var moment = require('moment-timezone');

exports.addAdminChannelArray = function(request, response){
  var peoplePromises = [];
  var userList = [];
  var msg = "";
  for(var i=0;i<request.body.users.length;i++){
    peoplePromises.push(new Promise(function(resolve,reject){
      request.body.user = request.body.users[i];
      User.findOne({ regId : request.body.user}, function(err, returnedUser){
        if(err){
          userList.push(request.body.user);
          msg = "internal error.";
          resolve();
        }
        else if(!returnedUser){
          userList.push(request.body.user);
          msg = "user not register.";
          resolve();
        }
        else{
          request.body.user = returnedUser._id;
          checkUserAndChannel(request.body.user, request.query.id)
          .then(function(returnedInfo){
            if(returnedInfo.hasOwnProperty('msg')){
              userList.push(request.body.user);
              msg = returnedInfo.msg;
              resolve();
            }
            else{
              check_permission_channel(request, function(code, err, channel){
                if(code != 200){
                  userList.push(request.body.user);
                  msg = err.err;
                  resolve();
                }
                else{
                  Channel.findByIdAndUpdate(request.query.id, {
                    $addToSet : {admins : request.body.user}
                  }, function(err, updatedChannel){
                    if(err){
                      userList.push(request.body.user);
                      msg = "internal error.";
                      resolve();
                    }
                    else if(!updatedChannel){
                      userList.push(request.body.user);
                      msg = "channel not found.";
                      resolve();
                    }
                    else{
                      User.findByIdAndUpdate(request.body.user, {
                        $addToSet : {admin_channels : request.query.id}
                      }, function(err, updatedUser){
                        if(err){
                          userList.push(request.body.user);
                          msg = "internal error.";
                          resolve();
                        }
                        else if(!updatedUser){
                          userList.push(request.body.user);
                          msg = "user not found.";
                          resolve();
                        }
                        else{
                          resolve();
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
    }));
  }
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

exports.addAdminEventArray = function(request, response){
  var peoplePromises = [];
  var userList = [];
  var msg = "";
  for(var i=0;i<request.body.users.length;i++){
    peoplePromises.push(new Promise(function(resolve, reject){
      request.body.user = request.body.users[i];
      User.findOne({ regId : request.body.user }, function(err, returnedUser){
        if(err){
          userList.push(request.body.user);
          msg = "internal error.";
          resolve();
        }
        else if(!returnedUser){
          userList.push(request.body.user);
          msg = "user not register.";
          resolve();
        }
        else{
          request.body.user = returnedUser._id;
          checkUserAndEvent(request.body.user, request.query.id)
          .then(function(returnedInfo){
            if(returnedInfo.hasOwnProperty('msg')){
              userList.push(request.body.user);
              msg = returnedInfo.msg;
              resolve();
            }
            else{
              check_permission(request, function(code, err, returnedInfo){
                if(code == 403){
                  if(returnedInfo == undefined){
                    userList.push(request.body.user);
                    msg = err.err;
                    resolve();
                  }
                  else{
                    check_permission_channel_vol2(request.user, returnedInfo, function(code1, err1, channel){
                      if(code1 != 200){
                        userList.push(request.body.user);
                        msg = err1.err;
                        resolve();
                      }
                      else{
                        Event.findByIdAndUpdate(request.query.id, {
                          $addToSet : {admins : request.body.user}
                        }, function(err, updatedEvent){
                          if(err){
                            userList.push(request.body.user);
                            msg = "internal error.";
                            resolve();
                          }
                          else if(!updatedEvent){
                            userList.push(request.body.user);
                            msg = "event not found.";
                            resolve();
                          }
                          else{
                            User.findByIdAndUpdate(request.body.user, {
                              $addToSet : {admin_events : request.query.id}
                            }, function(err, updatedUser){
                              if(err){
                                userList.push(request.body.user);
                                msg = "internal error.";
                                resolve();
                              }
                              else if(!updatedUser){
                                userList.push(request.body.user);
                                msg = "user not found.";
                                resolve();
                              }
                              else{
                                resolve();
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }
                else if(code != 200){
                  userList.push(request.body.user);
                  msg = err.err;
                  resolve();
                }
                else{
                  Event.findByIdAndUpdate(request.query.id, {
                    $addToSet : {admins : request.body.user}
                  }, function(err, updatedEvent){
                    if(err){
                      userList.push(request.body.user);
                      msg = "internal error.";
                      resolve();
                    }
                    else if(!updatedEvent){
                      userList.push(request.body.user);
                      msg ="event not found.";
                      resolve();
                    }
                    else{
                      User.findByIdAndUpdate(request.body.user, {
                        $addToSet : {admin_events : request.query.id}
                      }, function(err, updatedUser){
                        if(err){
                          userList.push(request.body.user);
                          msg = "internal error.";
                          resolve();
                        }
                        else if(!updatedUser){
                          userList.push(request.body.user);
                          msg = "user not found.";
                          resolve();
                        }
                        else{
                          resolve();
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
    }));
  }
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

exports.deleteAdminChannelArray = function(request, response){
  var peoplePromises = [];
  var userList = [];
  var msg = "";
  for(var i=0;i<request.body.users.length;i++){
    peoplePromises.push(new Promise(function(resolve, reject){
      request.body.user = request.body.users[i];
      User.findOne({ regId : request.body.user }, function(err, returnedUser){
        if(err){
          userList.push(request.body.user);
          msg = "internal error.";
          resolve();
        }
        else if(!returnedUser){
          userList.push(request.body.user);
          msg = "user not register.";
          resolve();
        }
        else{
          request.body.user = returnedUser._id;
          checkUserAndChannel(request.body.user, request.query.id)
          .then(function(returnedInfo){
            if(returnedInfo.hasOwnProperty('msg')){
              userList.push(request.body.user);
              msg = returnedInfo.msg;
              resolve();
            }
            else{
              check_permission_channel(request, function(code, err, channel){
                if(code != 200){
                  userList.push(request.body.user);
                  msg = err.err;
                  resolve();
                }
                else{
                  var queryId = mongoose.Types.ObjectId(request.query.id);
                  User.findByIdAndUpdate(request.body.user, {
                    $pull : {admin_channels : queryId}
                  }, {multi : true}, function(err, updatedUser){
                    if(err){
                      userList.push(request.body.user);
                      msg = "internal error.";
                      resolve();
                    }
                    else if(!updatedUser){
                      userList.push(request.body.user);
                      msg = "user not found.";
                      resolve();
                    }
                    else{
                      var bodyUser = mongoose.Types.ObjectId(request.body.user);
                      Channel.findByIdAndUpdate(request.query.id, {
                        $pull : {admins : bodyUser}
                      }, {multi : true}, function(err, updatedChannel){
                        if(err){
                          userList.push(request.body.user);
                          msg = "internal error.";
                          resolve();
                        }
                        else if(!updatedChannel){
                          userList.push(request.body.user);
                          msg = "channel not found.";
                          resolve();
                        }
                        else{
                          resolve();
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
    }));
  }
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

exports.deleteAdminEventArray = function(request, response){
  var peoplePromises = [];
  var userList = [];
  var msg = "";
  for(var i=0;i<request.body.users.length;i++){
    request.body.user = request.body.users[i];
    User.findOne({ regId : request.body.user }, function(err, returnedUser){
      if(err){
        userList.push(request.body.user);
        msg = "internal error.";
        resolve();
      }
      else if(!returnedUser){
        userList.push(request.body.user);
        msg = "user not register.";
        resolve();
        response.status(404).json({msg:"user not register."});
      }
      else{
        request.body.user = returnedUser._id;
        checkUserAndEvent(request.body.user, request.query.id)
        .then(function(returnedInfo){
          if(returnedInfo.hasOwnProperty('msg')){
            userList.push(request.body.user);
            msg = returnedInfo.msg;
            resolve();
          }
          else{
            check_permission(request, function(code, err, returnedInfo){
              if(code == 403){
                check_permission_channel_vol2(request.user, returnedInfo, function(code1, err1, channel){
                  if(code1 != 200){
                    userList.push(request.body.user);
                    msg = err1.err;
                    resolve();
                  }
                  else{
                    var queryId = mongoose.Types.ObjectId(request.query.id);
                    User.findByIdAndUpdate(request.body.user, {
                      $pull : {admin_events : queryId}
                    }, {multi : true}, function(err, updatedUser){
                      if(err){
                        userList.push(request.body.user);
                        msg = "internal error.";
                        resolve();
                      }
                      else if(!updatedUser){
                        userList.push(request.body.user);
                        msg = "user not found.";
                        resolve();
                      }
                      else{
                        var bodyUser = mongoose.Types.ObjectId(request.body.user);
                        Event.findByIdAndUpdate(request.query.id, {
                          $pull : {admins : bodyUser}
                        }, {multi : true}, function(err, updatedEvent){
                          if(err){
                            userList.push(request.body.user);
                            msg = "internal error.";
                            resolve();
                          }
                          else if(!updatedEvent){
                            userList.push(request.body.user);
                            msg = "event not found.";
                            resolve();
                          }
                          else{
                            resolve();
                          }
                      });
                      }
                    });
                  }
                });
              }
              else if(code != 200){
                userList.push(request.body.user);
                msg = err.err;
                resolve();
              }
              else{
                var queryId = mongoose.Types.ObjectId(request.query.id);
                User.findByIdAndUpdate(request.body.user, {
                  $pull : {admin_events : queryId}
                }, {multi : true}, function(err, updatedUser){
                  if(err){
                    userList.push(request.body.user);
                    msg = "internal error.";
                    resolve();
                  }
                  else if(!updatedUser){
                    userList.push(request.body.user);
                    msg = "user not found.";
                    resolve();
                  }
                  else{
                    var bodyUser = mongoose.Types.ObjectId(request.body.user);
                    Event.findByIdAndUpdate(request.query.id, {
                      $pull : {admins : bodyUser}
                    }, {multi : true}, function(err, updatedEvent){
                      if(err){
                        userList.push(request.body.user);
                        msg = "internal error.";
                        resolve();
                      }
                      else if(!updatedEvent){
                        userList.push(request.body.user);
                        msg = "event not found.";
                        resolve();
                      }
                      else{
                        resolve();
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
  }
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
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
			info.code = err.code;
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
          var data = {};
          data['msg'] = "error in finding event";
					data['code'] = 500;
          reject(data);
        }
        else if(!returnedInfo){
          var data = {};
          data['msg'] = "event not exist.";
					data['code'] = 404;
          reject(data);
        }
        else if(returnedInfo['tokenDelete']){
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
          var data = {};
          data['msg'] = "error in finding user.";
					data['code'] = 500;
					reject(data);
        }
        else if(!returnedUser){
          var data = {};
          data['msg'] = "no user exist.";
					data['code'] = 404;
          reject(data);
        }
        else if(returnedUser['tokenDelete']){
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
			info.code = err.code;
      resolve(info);
    })
    .then(function(returnedInfo){
      info['event'] = returnedInfo[0]['_id'];
      info['user'] = returnedInfo[1]['_id'];
      resolve(info);
    });
  });
};

var check_permission = function(request,callback){
	if(request.user === undefined){
		if(request.authentication_info.message === "No auth token" )
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
    if(request.authentication_info.message === "No auth token" )
			callback(403,{err:"Please login"});
		else
			callback(403,{err:request.authentication_info.message});
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

//============temporarily code while regId is not working=====================
exports.addAdminChannelFBArray = function(request, response){
  for(var i=0;i<request.body.users.length;i++){
    request.body.user = request.body.users[i];
    User.findOne({ facebookId : request.body.user}, function(err, returnedUser){
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
  }
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

exports.addAdminEventFBArray = function(request, response){
  for(var i=0;i<request.body.users.length;i++){
    request.body.user = request.body.users[i];
    User.findOne({ facebookId : request.body.user }, function(err, returnedUser){
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
  }
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

exports.deleteAdminChannelFBArray = function(request, response){
  for(var i=0;i<request.body.users.length;i++){
    request.body.user = request.body.users[i];
    User.findOne({ facebookId : request.body.user }, function(err, returnedUser){
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
  }
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

exports.deleteAdminEventFBArray = function(request, response){
  for(var i=0;i<request.body.users.length;i++){
    request.body.user = request.body.users[i];
    User.findOne({ facebookId : request.body.user }, function(err, returnedUser){
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
  }
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

exports.addAdminChannelMGArray = function(request, response){
  for(var i=0;i<request.body.users.length;i++){
    request.body.user = request.body.users[i];
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
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

exports.addAdminEventMGArray = function(request, response){
  for(var i=0;i<request.body.users.length;i++){
    request.body.user = request.body.users[i];
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
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

exports.deleteAdminChannelMGArray = function(request, response){
  for(var i=0;i<request.body.users.length;i++){
    request.body.user = request.body.users[i];
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
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

exports.deleteAdminEventMGArray = function(request, response){
  for(var i=0;i<request.body.users.length;i++){
    request.body.user = request.body.users[i];
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
  Promise.all(peoplePromises).then(function(){
    if(userList.length != 0){
      response.status(500).json({"msg" : msg, "user_list" : userList});
    }
    else{
      response.status(201).json({"msg" : "done."});
    }
  });
};

//============temporarily code while regId is not working (end) =====================

//============something maybe useful in the future=====================
// exports.addAdminChannelArray = function(request, response){
//   User.find()
//       .where('regId')
//       .in(users)
//       .exec(function(err, returnedUsers){
//         if(err){
//           response.status(500).json({msg:"internal error."});
//         }
//         else if(!returnedUsers){
//           response.status(404).json({msg:"users are not registered."});
//         }
//         else{
//           Channel.findById(request.query.id, function(err, channel){
//             if(err){
//               response.status(500).json({msg : "internal error."});
//             }
//             else if(!channel){
//               response.status(404).json({msg : "channel not found."});
//             }
//             else{
//               check_permission_channel(request, function(code, err, channel){
//                 if(code != 200){
//                   response.status(code).json(err);
//                 }
//                 else{
//                   Channel.findByIdAndUpdate(request.query.id, {
//                     $addToSet : {admins : returnedUsers}
//                   }, function(err, updatedChannel){
//                     if(err){
//                       response.status(500).json({msg:"internal error."});
//                     }
//                     else if(!updatedChannel){
//                       response.status(404).json({msg:"channel not found."});
//                     }
//                     else{
//                       var userIDs = [];
//                       for(var i=0;i<returnedUsers.length;i++){
//                         userIDs.push(returnedUsers[i]._id);
//                       }
//                       User.update({ _id : {$in : userIDs}}, {
//                         $addToSet : {admin_channels : request.query.id}
//                       },{
//                         multi : true
//                       }, function(err){
//                         if(err){
//                           response.status(500).json({msg:"internal error."});
//                         }
//                         else{
//                           response.status(201).json({msg:"done."});
//                         }
//                       });
//                     }
//                   });
//                 }
//               });
//             }
//           });
//         }
//       });
// };

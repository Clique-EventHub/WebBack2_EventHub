var User = require('mongoose').model('User');
var Channel = require('mongoose').model('Channel');
var Event = require('mongoose').model('Event');
var mongoose = require('mongoose');
var moment = require('moment-timezone');

exports.addAdminChannel = function(request, response){
  User.findOne({ regId : request.body.user}, function(err, returnedUser){
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
  User.findOne({ regId : request.body.user }, function(err, returnedUser){
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

exports.selectPending = function(request, response){
  var accepteds = request.body.yes;
  var rejecteds = request.body.no;
  check_permission(request, function(code, err, returnedInfo){
    if(code != 200){
      response.status(code).json({err});
    }
    else if(!returnedInfo.choose_joins){
      response.status(400).json({msg : "this event cannot choose join people."});
    }
    else{
      var promises = [];
      var completedButRejected = [];
      if(accepteds){
        promises.push(new Promise(function(resolve, reject){
            let promises2 = [];
            for(let i=0;i<accepteds.length;i++){
              promises2.push(new Promise(function(resolve, reject){
                let index = i;
                let theIndex = returnedInfo.who_accepted.indexOf(accepteds[index]);
                if(theIndex == -1){
                  returnedInfo.who_accepted.push(accepteds[index]);
                }
                theIndex = returnedInfo.who_pending.indexOf(accepteds[index]);
                if(theIndex != -1){
                  returnedInfo.who_pending.splice(theIndex, 1);
                }
                resolve();
              }));
            }
            Promise.all(promises2).then(function(){
              resolve();
            });
        }));
      }
      if(rejecteds){
        promises.push(new Promise(function(resolve, reject){
          let promises2 = [];
          for(let i=0;i<rejecteds.length;i++){
            promises2.push(new Promise(function(resolve, reject){
              let index = i;
              let theIndex = returnedInfo.who_rejected.indexOf(rejecteds[index]);
              if(theIndex == -1){
                returnedInfo.who_rejected.push(rejecteds[index]);
              }
              theIndex = returnedInfo.who_pending.indexOf(rejecteds[index]);
              if(theIndex != -1){
                returnedInfo.who_pending.splice(theIndex, 1);
              }
              theIndex = returnedInfo.who_join.indexOf(rejecteds[index]);
              if(theIndex != -1){
                returnedInfo.who_join.splice(theIndex, 1);
              }
              theIndex = returnedInfo.who_completed.indexOf(rejecteds[index]);
              if(theIndex != -1){
                returnedInfo.who_completed.splice(theIndex, 1);
                completedButRejected.push(rejecteds[index]);
              }
              resolve();
            }));
          }
          Promise.all(promises2).then(function(){
            resolve();
          });
        }));
      }
      Promise.all(promises).then(function(){
        Event.findByIdAndUpdate(request.query.id, {
          $set : {
            who_accepted : returnedInfo.who_accepted,
            who_rejected : returnedInfo.who_rejected,
            who_pending : returnedInfo.who_pending,
            who_join : returnedInfo.who_join,
            who_completed : returnedInfo.who_completed
          }
        }, function(err, updatedEvent){
          if(err){
            response.status(500).json({msg : "internal error."});
          }
          else if(!updatedEvent){
            response.status(404).json({msg : "event not found."});
          }
          else{
            let promises3 = [];
            let errorList = [];
            promises3.push(new Promise(function(resolve, reject){
              let promises4 = [];
              let noti = {};
              noti.title = "You are accepted from "+updatedEvent.title+" to join this event.";
              noti.link = 'https://www.cueventhub.com/event?id='+updatedEvent._id+'&stat=true';
              noti.photo = updatedEvent.picture;
              noti.source = updatedEvent.title;
              noti.seen = false;
              let date = new Date();
              noti.timestamp = date.getTime();
              if(accepteds){
                for(let i=0;i<accepteds.length;i++){
                  promises4.push(new Promise(function(resolve, reject){
                    let index = i;
                    User.findByIdAndUpdate(accepteds[index], {
                      $addToSet : { notification : noti,
                                    accepted_events : updatedEvent._id}
                    }, function(err, updatedUser){
                      if(err){
                        errorList.push(accepteds[index]);
                        resolve();
                      }
                      else if(!updatedUser){
                        errorList.push(accepteds[index]);
                        resolve();
                      }
                      else{
                        resolve();
                      }
                    });
                  }));
                }
              }
              Promise.all(promises4).then(function(){
                resolve();
              });
            }));
            promises3.push(new Promise(function(resolve, reject){
              let promises4 = [];
              let noti = {};
              noti.title = "You are rejected from "+updatedEvent.title+"to join this event.";
              noti.link = 'https://www.cueventhub.com/event?id='+updatedEvent._id+'&stat=true';
              noti.photo = updatedEvent.picture;
              noti.source = updatedEvent.title;
              noti.seen = false;
              let date = new Date();
              noti.timestamp = date.getTime();
              if(rejecteds){
                for(let i=0;i<rejecteds.length;i++){
                  promises4.push(new Promise(function(resolve, reject){
                    let index = i;
                    User.findByIdAndUpdate(rejecteds[index], {
                      $addToSet : { notification : noti },
                      $pull : { join_events : updatedEvent._id, already_joined_events : updatedEvent._id }
                    }, function(err, updatedUser){
                      if(err){
                        errorList.push(rejecteds[index]);
                        resolve();
                      }
                      else if(!updatedUser){
                        errorList.push(rejecteds[index]);
                        resolve();
                      }
                      else{
                        resolve();
                      }
                    });
                  }));
                }
              }
              Promise.all(promises4).then(function(){
                resolve();
              });
            }));
            Promise.all(promises3).then(function(){
              if(errorList.length == 0){
                response.status(201).json({msg : "done."});
              }
              else{
                let info = {};
                info.msg = "error.";
                info.users = errorList;
                response.status(500).json(info);
              }
            });
          }
        });
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
			info.code = err.code;
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
  var date = new moment().tz('Asia/Bangkok');
	var current = date.toDate();
  if(request.user === undefined){
		if(request.authentication_info.message === "No auth token" )
			callback(403,{err:"Please login"});
		else
			callback(403,{err:request.authentication_info.message});
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
              if(event.who_accepted.indexOf(request.body.users[i]) != -1) join_users.push(mongoose.Types.ObjectId(request.body.users[i]));
            }
            var timeDiff1 = Math.abs(current.getTime() - event.date_start.getTime());
            var timeSign1 = current.getTime() - event.date_start.getTime();
            timeDiff1 = Math.ceil(timeDiff1 / (1000*3600*24));
            var timeDiff2 = Math.abs(event.date_end.getTime() - current.getTime());
            var timeSign2 = event.date_end.getTime() - current.getTime();
            timeDiff2 = Math.ceil(timeDiff2 / (1000*3600*24));
            if(( timeSign1 < 0 && timeDiff1 > 0 ) || ( timeSign2 < 0 && timeDiff2 > 0 )){
                response.status(403).json({msg : "day not valid."});
                return ;
            }
            Event.findByIdAndUpdate(event._id, {
              $addToSet : {who_completed : {$each : join_users}},
              $pull : {who_accepted : {$in : join_users}}
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
          if(event.who_accepted.indexOf(request.body.users[i]) != -1) join_users.push(mongoose.Types.ObjectId(request.body.users[i]));
        }
        var timeDiff1 = Math.abs(current.getTime() - event.date_start.getTime());
        var timeSign1 = current.getTime() - event.date_start.getTime();
        timeDiff1 = Math.ceil(timeDiff1 / (1000*3600*24));
        var timeDiff2 = Math.abs(event.date_end.getTime() - current.getTime());
        var timeSign2 = event.date_end.getTime() - current.getTime();
        timeDiff2 = Math.ceil(timeDiff2 / (1000*3600*24));
        if(( timeSign1 < 0 && timeDiff1 > 0 ) || ( timeSign2 < 0 && timeDiff2 > 0 )){
            response.status(403).json({msg : "day not valid."});
            return ;
        }
        Event.findByIdAndUpdate(event._id, {
          $addToSet : {who_completed : {$each : join_users}},
          $pull : {who_accepted : {$in : join_users}}
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
exports.addAdminChannelFB = function(request, response){
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
};

exports.addAdminEventFB = function(request, response){
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
};

exports.deleteAdminChannelFB = function(request, response){
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
};

exports.deleteAdminEventFB = function(request, response){
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
};

exports.addAdminChannelMG = function(request, response){
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
};

exports.addAdminEventMG = function(request, response){
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
};

exports.deleteAdminChannelMG = function(request, response){
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
};

exports.deleteAdminEventMG = function(request, response){
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
};

//============temporarily code while regId is not working (end) =====================

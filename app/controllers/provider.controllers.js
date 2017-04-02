var User = require('mongoose').model('User');
var master_key_password = require('../../config/config').master_key_password;


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
            else response.status(200).json({user:updatedUser,'msg':'done'});
          });        
        }
        else{
          response.status(403).json({'msg':'wrong password'});  
        }
      }
    });
  }
  else{
    response.status(403).json({err:request.authen.info});
  }
}

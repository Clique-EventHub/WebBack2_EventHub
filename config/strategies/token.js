var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var User = require('mongoose').model('User');
var config =require('../config');
var _ = require('lodash');
var fields = require('../utility').loginFieldUser;

module.exports = function(){
	var jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
	jwtOptions.secretOrKey = config.jwtSecret;
	jwtOptions.ignoreExpiration = false;

	passport.use(new JwtStrategy(jwtOptions,function(payload,done){
		User.findById(payload.id,function(err, user){
			if(err){
				console.error(new Date().toString());
				console.error(payload);
				console.error(err);
				done(err,false);
			}
			else if(user){
				var result = {};

				fields.forEach(function(field){
					result[field] = _.get(user,field,null);
				});
				let email = _.get(user,'email', null);
				if(email){
					result['email'] = email;
				}
				done(null,result);
			}
			else{
				console.log('passport case 3');
				done(new Error("no user"),false);
			}
		});
	}));

}

var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var User = require('mongoose').model('User');
var config =require('../config');

module.exports = function(){
	var jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
	jwtOptions.secretOrKey = config.jwtSecret;
	jwtOptions.ignoreExpiration = false;

	passport.use(new JwtStrategy(jwtOptions,function(payload,done){
		User.findById(payload.id,function(err, user){
			if(err){
				console.error(err);
				done(err,false);
			}
			else if(user){
				var result = {};
				var fields = ['_id','firstName','lastName','picture','picture_200px',
				'gender','phone','shirt_size','birth_day','allergy','disease',
				'regId','facebookId','twitterUsername','lineId','notification','admin_events',
				'subscribe_channels','interest_events','join_events','admin_channels','admin_channels','email'];
				fields.forEach(function(field){
					result[field] = user[field] ? user[field] : null;
				});
				done(null,result);
			}
			else{
				console.log('case3');
				done(null,false);
			}
		});
	}));
}

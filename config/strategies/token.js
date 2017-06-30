var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var User = require('mongoose').model('User');
var config =require('../config');
var _ = require('lodash');

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
				var fields = ['_id','firstName','lastName','nick_name','picture','picture_200px',
				'gender','phone','shirt_size','birth_day','allergy','disease','regId','facebookId',
				'twitterUsername','lineId','notification','admin_events','tag_like','emer_phone',
				'already_joined_events','subscribe_channels','interest_events','join_events','major',
				'admin_channels','admin_channels','firstNameTH','lastNameTH','dorm_bed','dorm_room',
				'dorm_building'];
				fields.forEach(function(field){
					result[field] = _.get(user,field,null);
				});
				let email = _.get(user,'email', null);
				if(email){
				}
				done(null,result);
			}
			else{
				console.log('passport case 3 ');
				done(null,false);
			}
		});
	}));
}

var mongoose = require('mongoose');
var crypto = require('crypto');
var Moment = require('moment-timezone');
var Schema = mongoose.Schema;
var userSchema = new Schema({

//personal infomation
	name :{
		type:String,
		trim : true,
		unique : true,
		// index:true,
		// required:true,
		validate: [
			function(name){
				return /^(?:[aA-zZ]+| |-|[0-9]+|[\u0E01-\u0E5B]+)+$/.test(name);
			}, 'Name must consist of alphabets, whitespaces and hyphens.'
		]
	},
	username:{
		type:String,
		unique : true,
		trim : true,
		required: true,
		validate: [
			// {
			// 	validator : function(username){
			// 		return /^[aA-zZ]/.test(username);
			// 	}, msg : 'Username must start with an English alphabet'
			// },
			// {
			// 	validator : function(username){
			// 		return /^[aA-zZ]+\d*\.{0,1}[aA-zZ]*([aA-zZ]|\d)*$/.test(username);
			// 	}, msg : 'Username must consist of alphabets, numbers and a single dot'
			// },
			// {
			// 	validator : function(username){
			// 		return /^[aA-zZ](?:[aA-zZ]+|[0-9]+)+\.{0,1}(?:[aA-zZ]+|[0-9]+)+$/.test(username);
			// 	}, msg : 'Only one dot allowed and it can not be the fisrt or the last character of the username'
			// },
			{
				validator : function(username){
					return username && username.length >=6 && username.length <= 20;
				}, msg : 'Username must be 6 - 20 characters long.'
			}
		]
	},
	password :{
		type:String,
		// required: true,
		validate: [
			function(password){
				return password && password.length >=6 && password.length <=25;
			},
			'Password must be 6 - 25 characters long.'
		]
	},
	salt:{
			type: String,
			// required: true,
			trim: true
	},
	firstName : {
		type: String,
		trim: true,
		default:null
	},
	lastName : {
		type: String,
		trim: true,
		default:null
	},
	nick_name: {
		type: String,
		trim: true,
		default:null
	},
	picture:{
		type:String,
		default:null
	},
	picture_200px:{
		type:String,
		default:null
	},
	gender:{
		type:String,
		default:null
	},
	phone:{
		type:String,
		default:null
	},
	shirt_size:{
		type:String,
		default:null
	},
	birth_day:{
		type:Date,
		default:null
	},
	allergy:{
		type:String,
		default:null
	},
	disease:{
		type:String,
		default:null
	},
	profileUrl:String,

	regId:{
		type:String,
		default:null
	},
	provider:{
		type:String,
		default:null
	},   //OAuth provider
	facebookId:{
		type:String,
		default:null
	},
	facebookData:{},
	twitterUsername:{
		type:String,
		default:null
	},
	lineId:{
		type:String,
		default:null
	},

	admin_channels:[],
	join_events:[],
	interest_events:[],
	subscribe_channels:[],


//stat
	tag_visit:{},
	event_visit:{},
	channel_visit:{},


	tokenDelete:{
		type:Boolean,
		default: false
	},
	created_date:{
		type: 'Moment',
		default: new Moment()
	},
	lastModified:{
		type: 'Moment',
		default: new Moment()
	},
	lastOnline:{
		type: 'Moment',
		default: new Moment()
	}
});
// do this before save
userSchema.pre('save',function(next){
	if(this.password){
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});
// instance method
userSchema.methods.hashPassword = function(password){
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64,'sha512').toString('base64');
}

userSchema.methods.authenticate = function(password){
	return this.password === this.hashPassword(password);
};
// find the unique username from different OAuth
userSchema.statics.findUniqueUsername = function(username, suffix, callback){
	var _this = this;
	var possibleUsername = username + (suffix || '');
	_this.findOne({
		username : possibleUsername
	}, function(err, user){
		if(!err){
			if(!user) callback(possibleUsername);
			else return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
		}
		else{
			callback(null);
		}
	});
};

mongoose.model('User',userSchema);

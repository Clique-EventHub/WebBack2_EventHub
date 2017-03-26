var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var userSchema = new Schema({

//personal infomation
	name :{
		type:String,
		trim : true,
		// unique : true,
		// index:true,
		required:true,
		validate: [
			function(name){
				return /^[aA-zZ]+\-{0,1}[aA-zZ]+\-{0,1}[aA-zZ]*\-{0,1}[aA-zZ]*$/.test(name);
			}, 'name should have only alphabet and hyphen'
		]
	},
	username:{
		type:String,
		unique : true,
		trim : true,
		required: true,
		validate: [
			{
				validator : function(username){
					return /^[a-z]+\d*\.{0,1}[a-z]*([a-z]|\d)*$/.test(username);
				}, msg : 'username must have only lowercase, digit and a single dot'
			},
			{
				validator : function(username){
					return /^[a-z]+\.{0,1}[a-z]+$/.test(username);
				}, msg : 'dot should not be fisrt or last character of username'
			},
			{
				validator : function(username){
					return username && username.length >=3;
				}, msg : 'username must be at least 3 characters'
			}
		]
	},
	password :{
		type:String,
		validate: [
			function(password){
				return password && password.length >=6;
			},
			'Password must be at least 6 characters'
		]
	},
	salt:{
			type: String
	},
	picture:String,
	gender:String,
	phone:String,
	shirt_size:String,

	regId:String,
	facebookId:String,
	facebookData:{},

	own_channels:[],
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
		type: Date,
		default: Date.now
	},
	lastModified:{
		type:Date,
		default: Date.now
	},
	lastOnline:{
		type:Date,
		default: Date.now
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

mongoose.model('User',userSchema);

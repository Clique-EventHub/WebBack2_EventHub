let Event = require('mongoose').model('Event');
let Channel = require('mongoose').model('Channel');
let User = require('mongoose').model('User');
let Form = require('mongoose').model('Form');

// help function should be in this file
exports.checkPermission = function ({ user, authentication_info }, id, opt, callback) {
	console.log(new Date(),'checking permission ',id,opt);
	console.log(user);
	console.log(authentication_info);
	if(user){
		if(opt === "event"){
			if(user.admin_events.indexOf(id) === -1){
				console.error('no permission');
				callback ({err:"No permission","code":403});
			}
			else callback({msg:'OK'});
		}
		else if(opt === "channel"){
			if(user.admin_channels.indexOf(id) === -1){
				console.error('no permission');
				callback ({err:"No permission","code":403});
			}
			else callback({msg:'OK'});
		}
	}
	else{
		console.log('no user');
		if(authentication_info.message === "No auth token")
			callback({err:"Please login"});
		else
			callback({err:authentication_info.message});
	}
}

exports.findMODEL = function(id,opt,callback){
	// callback (error,model);
	console.log("findMODEL...",id,opt);
	console.log(new Date());
	if(opt === "event"){
		Event.findById(id,function(err,event){
			if(err){
				callback({code:500,err:'find event error'});
				console.error(err);
			}
			else if(!event) {
				console.error(new Date(),{
					err : "event not found",
					func : "utility - findMODEL"
				});
				callback({code:404,err:'event not found'});
			}
			else{
				callback(null,event);
			}
		});
	}
	else if(opt === "channel"){
		Channel.findById(id,function(err,channel){
			if(err){
				callback({code:500,err:'find channel error'});
				console.error(err);
			}
			else if(!channel) {
				console.error(new Date(),{
					err : "channel not found",
					func : "utility - findMODEL"
				});
				callback({code:404,err:'channel not found'});
			}
			else{
				callback(null,channel);
			}
		});
	}
	else if(opt === "form"){
		Form.findById(id,function(err,form){
			if(err){
				callback({code:500,err:'find form error'});
				console.error(err);
			}
			else if(!form) {
				console.error(new Date(),{
					err : "form not found",
					func : "utility - findMODEL"
				});
				callback({code:404,err:'form not found'});
			}
			else{
				callback(null,form);
			}
		});
	}
	else if(opt === "user"){
		User.findById(id,function(err,user){
			if(err){
				callback({code:500,err:'find user error'});
				console.error(err);
			}
			else if(!user) {
				console.error(new Date(),{
					err : "user not found",
					func : "utility - findMODEL"
				});
				callback({code:404,err:'user not found'});
			}
			else{
				callback(null,form);
			}
		});
	}
	else callback({err:'invalid model'});
}

exports.getableFieldEvent = ['_id','title','about','video','channel','location',
	'date_start','date_end','time_start','time_end','refs','time_each_day',
	'picture','picture_large','year_require','faculty_require',
	'tags','forms','notes',
	'contact_information','require_field','optional_field',
	'agreement','joinable_start_time','joinable_end_time',
	'joinable_amount','optional_field','require_field',
	'outsider_accessible'];

exports.getableFieldEventAdmin = ['_id','title','about','video','channel','location',
	'date_start','date_end','time_start','time_end','expire','refs','join','time_each_day',
	'picture','picture_large','year_require','faculty_require',
	'tags','forms','notes',
	'contact_information','require_field','optional_field','refs',
	'agreement','joinable_start_time','joinable_end_time',
	'joinable_amount','optional_field','require_field',
	'show','outsider_accessible'];
exports.getableStatEvent = ['who_join','who_interest',
	'visit', 'visit_per_day',
	'interest','interest_gender','interest_year',
	'join','join_gender','join_year', 'join_per_day'];

exports.editableFieldEvent = ['about','video','location','date_start','date_end',
	'time_start','time_end','picture','picture_large',
	'year_require','faculty_require','tags','refs',
	'agreement','contact_information','joinable_start_time','joinable_end_time',
	'joinable_amount','time_start','time_end','optional_field','require_field',
	'show','outsider_accessible','notes','time_each_day'];


exports.editableFieldChannel = ['name', 'picture', 'picture_large','detail','url','video'];

exports.getableFieldChannel = ['_id','name','verified','picture','picture_large','admins','events','detail','url','video'];

const userField = ['nick_name','picture','picture_200px','birth_day','twitterUsername','phone','shirt_size',
											'allergy','disease','emer_phone','tag_like','dorm_room','dorm_building','dorm_bed',
											'twitterUsername','lineId','notification'];

exports.editableFieldUser = userField;

exports.loginFieldUser = ['_id', 'firstName','lastName', 'gender','regId','facebookId',
				'admin_events', 'already_joined_events','subscribe_channels','interest_events','join_events','major',
				'admin_channels','admin_channels','firstNameTH','lastNameTH', ...userField ];

exports.postFieldForm = ['title','event','channel','questions'];

exports.getUserProfileFields = ['_id','firstName','lastName','nick_name','picture','picture_200px','email',
	'gender','phone','shirt_size','birth_day','allergy','disease','major','emer_phone','admin_events','admin_channels',
	'join_events','interest_events','subscribe_channels','already_joined_events','tag_like','dorm_bed','dorm_room','dorm_building',
	'regId','facebookId','twitterUsername','lineId','notification','firstNameTH','lastNameTH'];

exports.getFBUserProfile = ['_id','firstName','lastName','nick_name','picture','picture_200px','gender','major','admin_events','admin_channels',
'join_events','interest_events','subscribe_channels','already_joined_events','tag_like','regId','firstNameTH','lastNameTH'];

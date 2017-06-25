var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Moment = require('moment-timezone');

var channelSchema = new Schema({
	name :{
		type:String,
		trim : true,
		unique : true,
//		index:true,
		required:true
	},
	detail : {
		type : [],
		default : null
	},
	verified :{
		type:Boolean,
		default:false
	},
	created_date:{
		type: 'Moment',
		default: new Moment()
	},
	picture: {
		type: String,
		default: null
	},
	picture_large: [String],
	events : [Schema.Types.ObjectId],
	events_bin : [Schema.Types.ObjectId],
	admins : [Schema.Types.ObjectId],
	tokenDelete: {
		type:Boolean,
		default:false
	},
	lastModified:{
		type: 'Moment',
		default: new Moment()
	},
	who_subscribe:{
		type: [Schema.Types.ObjectId],
		default: []
	},

	//stat--------------
	visit: {
		type:Number,
		default: 0
	}
	//stat--------------


});

mongoose.model('Channel',channelSchema);

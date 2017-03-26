var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Moment = require('moment-timezone');

var channelSchema = new Schema({
	name :{
		type:String,
		// trim : true,
		// unique : true,
//		index:true,
		required:true
	},
	verified :{
		type:Boolean,
		default:false
	},
	created_date:{
		type: 'Moment',
		default: new Moment()
	},
	picture: String,
	picture_large: String,
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

	//stat--------------
	visit:Number
	//stat--------------


});

mongoose.model('Channel',channelSchema);

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Moment = require('moment-timezone');


let formSchema = new Schema({
	title :{
		index: true,
		type: String,
		trim: true,
		default: "Untitled",
		required: true
	},

	event : {
		type: Schema.Types.ObjectId,
	},

	channel : {
		type:Schema.Types.ObjectId,
	},

	questions: [{
		type :{
			// short answer, paragraph, bullet, checkbox, spinner
			type: String,
			trim: true,
			required: true,
			default: null
		},
		question : String,
		choices:[String]
	}],

	responses:[{
		firstName : String,
		lastName : String,
		user_id : {
			type:Schema.Types.ObjectId,
			required : true
		},
		answers:{}
	}],

	tokenDelete : {
		type : Boolean,
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
});

mongoose.model('Form',formSchema);

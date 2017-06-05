let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Moment = require('moment-timezone');


let formSchema = new Schema({
	title :{
		type: String,
		trim: true,
		default: "Untitled",
		required: true
	},

	event : Schema.Types.ObjectId,

	channel : {
		type:Schema.Types.ObjectId,
		required : true
	},

	questions: [{
		type :{
			// short answer, paragraph, bullet, checkbox, spinner
			type: String,
			trim: true,
			required: true,
			default: null
		},
		choices:[String]
	}],

	answers:[{
		name : String,
		id : {
			type:Schema.Types.ObjectId,
			required : true
		},
		
	}],

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

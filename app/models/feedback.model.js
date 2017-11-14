let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Moment = require('moment-timezone');


let feedbackSchema = new Schema({

	type :{
		index: true,
		type: String,
		trim: true,
		default: null,
	},
	
	text : {
		type: String,
		default: null,

	},

	read :{
		type: Boolean,
		default: false,
	},

	created_date:{
		type: 'Moment',
		default: new Moment()
	},

});

mongoose.model('Feedback',feedbackSchema);

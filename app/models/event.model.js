
var mongoose = require('mongoose');
var Moment = require('moment-timezone');
var Schema = mongoose.Schema;


var eventSchema = new Schema({
	title : {
		trim : true,
		type:String,
		required:true,
		unique : true
//		index:true
	},
	about : {
		type:String,
		default:null
	},
	channel : {
		type:Schema.Types.ObjectId,
		required : true
	},
	picture : {
		type:String,
		default:null
	},
	picture_large : {
		type : [String],
		default : []
	},
	video : {
		type:String,
		default:null
	},
	faculty_require: [],
	year_require:[],
	agreement :{
		type:String,
		default:null
	},
	location:{
		type:String,
		default:null
	},
	date_start:Date,
	date_end:Date,
	contact_information: {
		type:String,
		default:null
	},
	tags:[],
	expire:{
		type:Boolean,
		default:false
	},
	admins : [Schema.Types.ObjectId],

	forms : [{}], // list of objects { title : id }

	//stat-----------------------------------------------
	rating:{
		type:Number,
		default:0
	},
	rating_voter:{
		type:Number,
		default:0
	},
	joinable_start_time:Date,   //the period that user can join.
	joinable_end_time:Date,			//the period that user can join.
	time_start:Date,				//the actual time that this event will start.
	time_end:Date,					//the actual time that this event will end.
	optional_field:{
		type:[],
		default:[]
	},
	require_field:{
		type:[],
		default:[]
	},
	visit:{
		type:Number,
		default:0
	},
	visit_gender:{
		type:{},
		default:{'male':0,'female':0}
	},
	visit_year:{}, // { '58':10 , '59':30  }

	joinable_amount:{					// the max number of people that can join this event.
		type:Number,
		default:-1	//infinity
	},
	show:{								// show this event to public or not.
		type:Boolean,
		default:true
	},
	interest:{
		type:Number,
		default:0
	},
	interest_gender:{
		type:{},
		default:{'male':0,'female':0}
	},
	interested_year:{
		type : {},
		default : {}
	}, // { '57':10 , '58':30  }

	join:{
		type:Number,
		default:0
	},
	join_gender:{
		type:{},
		default:{'male':0,'female':0}
	},
	join_year:{
		type:{},
		default:null
	}, // { '57':10 , '58':30  }
	join_per_day:[], // {YYYY-MM-DD,number}
	visit_per_day:[], // {YYYY-MM-DD,number}
	momentum:{type:Number,default:0},

	//stat-------------------------------------------------

	tokenDelete:{
		type:Boolean,
		default: false
	},
	who_join: [Schema.Types.ObjectId],
	who_interest: {
		type:[Schema.Types.ObjectId],
		default:[]
	},
	who_completed : {
		type : [Schema.Types.ObjectId],
		default : []
	},
	created_date:{
		type:'Moment',
		default: new Moment()
	},
	Creator : Schema.Types.ObjectId,
	lastModified:{
		type:[],
		default:[]
	},
	outsider_accessible : {
		type : Boolean,
		default : true
	},
	join_faculty:{
		type:{},
		default:{}
	},
	interest_faculty:{
		type:{},
		default : {}
	},
	join_data:{
		type: [],
		default : []
	}
 });


eventSchema.pre('save',function(next){
	if(this.joinable_start_time == null) this.joinable_start_time = this.date_start;
	if(this.joinable_end_time == null) this.joinable_end_time = this.date_end;
	if(this.time_start == null)	this.time_start = this.date_start;
	if(this.time_end == null) this.time_end = this.date_end;
	next();
});

mongoose.model('Event',eventSchema);

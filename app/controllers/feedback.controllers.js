var Feedback = require('mongoose').model('Feedback');
var config = require('../../config/config');
var moment = require('moment-timezone');
var mongoose = require('mongoose');
var _ = require('lodash');
var { feedbackFields } = require('../../config/utility');


exports.get = function(request,response){
	Feedback.find({}, null, {sort: {created_date: -1}}, (err,feedbacks) => {
		if(err){
			console.error(err);
			response.status(500).json({err:"Internal Error"});
		}
		else{
			response.status(200).json({feedbacks});
		}
	});
}

function clean(feedback){
	let ret = {};
	console.log(feedback);
	console.log(feedbackFields);	
	for(let i=0; i<feedbackFields.length;i++){
		ret[feedbackFields[i]] = _.get(feedback,feedbackFields[i]);
	}
	console.log(ret);
	return ret;
}

exports.post = function(request, response){
	const fb = clean( request.body );
	let newFeedback = new Feedback(fb);
	newFeedback.save( (err, feedback) => {
		if( err ) {
			console.error(err);
			response.status(500).json({err:"Internal Error"});
		}
		else{
			response.status(200).json(feedback);
		}
	});
}

exports.put = function(request,response){
	let data = request.body.data;
	var ret = [], promises = [];

	console.log(data);
	for(let i=0; i<data.length; i++){
		promises.push( new Promise(function(resolve,reject){
			Feedback.findByIdAndUpdate(data[i].id,{$set:data[i]}, {new:true}, 
				function(err, result){
				if(err){
					console.error(err);
				}
				else{
					console.log(result);
					ret.push(result);
				}
				resolve();
			});
    }));	
	}
	
	Promise.all(promises).then( () => {
		if(ret.length == 0) response.status(500).json({err:"Internal Error"});
		else response.status(200).json({feedbacks:ret});
	});
}

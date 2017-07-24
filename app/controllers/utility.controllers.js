var utility = require('../../config/utility');
var _ = require('lodash');
exports.requestData = function(request,response){
	const reqFields = request.query.fields.split(',');		
	let ret = {};
	reqFields.forEach( field => {
		_.set(ret,field,utility[field]);	
	});
	response.json(ret);
}

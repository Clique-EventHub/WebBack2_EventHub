var feedback = require('../controllers/feedback.controllers');

module.exports = function(app){
	app.route('/feedback')
		.post(feedback.post)
		.get(feedback.get)
		.put(feedback.put);
}

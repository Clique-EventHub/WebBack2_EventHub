var Utility = require('../controllers/utility.controllers');

module.exports = function(app){

	app.get('/reqdata',Utility.requestData);

}


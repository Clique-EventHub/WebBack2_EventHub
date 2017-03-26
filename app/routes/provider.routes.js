var provider = require('../controllers/provider.controllers');
var passport = require('passport');
module.exports  = function(app){

	app.get('/provider',provider.render);
	app.post('/provider',passport.authenticate('local',{
		successRedirect: '/provider',
		failureRedirect: '/provider',
		failureFlash: true
	}));
	app.post('/provider/logout',provider.logout);
	app.route('/provider/signup')
			.get(provider.renderSignup)
			.post(provider.signup);

	app.get('/user/listall',provider.listall);
}

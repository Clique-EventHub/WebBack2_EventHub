var provider = require('../controllers/provider.controllers');
var passport = require('passport');
var User = require('mongoose').model('User');
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
	app.get('/provider/profile',provider.getProfile);
	app.get('/provider/stats',provider.showStat);

	app.route('/provider/editprofile')
		 .get(provider.getEditProfile)
		 .post(provider.postEditProfile);

	app.route('/provider/change-authen')
		 .get(provider.changeAuthentication)
		//  .post(provider.postChangeAuthentication);


	app.get('/provider/events',provider.getEvents);
	app.get('/provider/help',provider.getHelp);	//shows help instruction guide for providers.
	// app.get('/provider/settings');
	// app.get('/provider/messages');

}

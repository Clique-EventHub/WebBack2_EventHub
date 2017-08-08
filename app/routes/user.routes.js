var user = require('../controllers/user.controllers');
var passport = require('passport');

module.exports = function(app){

  app.route('/user')
    .get(user.getProfile)
    .put(user.putEditProfile);



  //app.post('/user/logout',user.logout);

  app.get('/oauth/facebook', passport.authenticate('facebook', {
    failureRedirect : '/user',
    scope : 'email'
  }));

  app.get('/findfb', user.findUserFromFB);
  app.get('/findmg', user.getUserProfileFromMongo);
  app.get('/findreg', user.findUserFromReg);
  app.put('/saw-noti', user.sawNoti);

  app.get('/oauth/facebook/callback', function(req, res, next) {
    // generate the authenticate method and pass the req/res
    passport.authenticate('facebook', function(err, user, info) {
      if (err) { return next(err); }
      else{
          res.json({token:info});
      }
    })(req, res, next);
  });

  // app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
  //   failureRedirect : '/user',
  //   successRedirect : '/'
  // }));
  app.get('/user/show-admin-events',user.getAdminEvents);
  app.get('/user/show-admin-channels',user.getAdminChannels);

  app.route('/user/subscribe')
      .get(user.getSubbedChannnel)
      .put(user.subScribeChannel);

  app.put('/user/unsubscribe',user.unsubScribe);

  app.route('/user/join')
      .get(user.getJoinedEvent)
      .put(user.joinAnEvent);

  app.route('/user/interest')
      .get(user.getInterestedEvent)
      .put(user.interestAnEvent);

  app.put('/user/uninterest', user.uninterestAnEvent);
  app.put('/user/reg', user.checkRegChula);

	if(process.env.NODE_ENV === "development"){
		app.delete('/user/clear', user.clear);   // use in test only removing user from database
		app.get('/user/listall', user.listAll);
	}
  // app.get('/user/help', user.getHelp);
  // app.get('/user/setting', user.getSetting);
  // app.get('user/message', user.getMessage);

  app.get('/login/facebook',user.login_fb);
	app.post('/auth/revoke',user.revokeToken);

}

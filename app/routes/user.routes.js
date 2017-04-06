var user = require('../controllers/user.controllers');
var passport = require('passport');

module.exports = function(app){

  app.get('/user',user.render);

  app.get('/user/listall', user.listAll);

  app.post('/user/logout',user.logout);

  app.get('/oauth/facebook', passport.authenticate('facebook', {
    failureRedirect : '/user',
    scope : 'email'
  }));



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



  app.put('/user/profile', user.putEditProfile);

  app.get('/user/profile',user.getProfile);

  app.get('/user/subbedchannels', user.getSubbedChannnel);
  app.get('/user/joinedevents', user.getJoinedEvent);
  app.get('/user/interestedevents', user.getInterestedEvent);

  app.delete('/user/clear', user.clear);   // use in test only removing user from database
  // app.get('/user/help', user.getHelp);
  // app.get('/user/setting', user.getSetting);
  // app.get('user/message', user.getMessage);

  app.get('/login/facebook',user.login_fb);


}

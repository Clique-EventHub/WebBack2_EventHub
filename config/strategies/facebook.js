var passport = require('passport');
var FaceBookStrategy = require('passport-facebook');
var config = require('../config');
var user = require('../../app/controllers/user.controllers');

module.exports = function(){
  passport.use(new FaceBookStrategy({
    clientID : config.facebook.clientID,
    clientSecret : config.facebook.clientSecret,
    callbackURL : config.facebook.callbackURL,
    profileFields : ['id','email','name','photos','profileUrl','age_range','birthday','gender'],
    passReqToCallback : true
  },function(req, accessToken, refreshToken, profile, done){
    var providerData = profile._json; //receive profile from fields we declare
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    var providerUserProfile = {
      firstName : profile.name.givenName,
      lastName : profile.name.familyName,
      email : profile.emails[0].value,
      username : profile.username,
      provider : 'facebook',
      facebookId : profile.id,
      facebookData : providerData,
      picture : profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
      profileUrl : profile.profileUrl
    };
   // user.saveOAuthUserProfile(req, providerUserProfile, done);
      done(null);
  }));
};

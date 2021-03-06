var passport = require('passport');
var mongoose = require('mongoose');

module.exports = function(){
  var User = mongoose.model('User');

  passport.serializeUser(function(user,done){
    done(null,user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById( id, '-password -salt', function(err,user){
      done(err,user);
    });
  });
  require('./strategies/local.js')();
  require('./strategies/facebook.js')();
  require('./strategies/token.js')();

};

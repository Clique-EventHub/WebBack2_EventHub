var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var user = require('mongoose').model('User');


module.exports = function(){
    passport.use(new LocalStrategy(function(username,password,done){
        user.findOne( {username: username}, function(err,user){
            if(err){
                console.err("Provider findOne error");
                return done(null,false,
                  {message: 'error'}
                );
            }
            if(!user || !user.authenticate(password)){
                return done(null,false,
                  {message: 'Invalid username or password'}
                );
            }
            return done(null,user);
        });
    }));
}

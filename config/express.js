var config = require('./config');
var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var multer = require('multer');
var cors = require('cors');
var passport = require('passport');
var validator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var Moment = require('moment-timezone');

module.exports = function(){

	var app = express();

	// setting environment ---------------------------------------

	if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));
	else if(process.env.NODE_ENV ==='common') app.use(morgan('common'));
	else app.use(compression);

	app.use(session({
		secret: 'secret_key',
		resave: false,
 		saveUninitialized: true
 	}));
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(validator());
	app.use(cors());
	app.use(express.static('./public'));
 	// end setting environment ---------------------------------------

 	//set view engine ------------------------------------------------
 	//use at compile time path relative to server.js
 	app.set('views','./app/views');
 	app.set('view engine','jade');
 	// end set view engine -------------------------------------------

 	app.use(flash());

 	app.use(passport.initialize());
 	app.use(passport.session());  // use express-session

 	// require at runtime time path relative to express.js

	app.use(function(request, response, next){
		passport.authenticate('jwt', {session : false},
			function(err, user, info){
				if(user){
					// request.user = {};
					// request.user.firstName = user.firstName;
					// request.user.lastName = user.lastName;
					// request.user.picture = user.picture;
					// request.user.shirt_size = user.shirt_size;
					// request.user.twitterUsername = user.twitterUsername;
					// request.user.lineId = user.lineId;
					// request.user.birth_day = user.birth_day;
					// request.user.disease = user.disease;
					// request.user.allergy = user.allergy;
					// request.user._id = user._id;
					// request.user.admin_events = user.admin_events;
					// request.user.isProviderId = user.isProviderId;
					request.user = user;
					console.log(user);
				}
				else{
					request.authen = info;
				}
				next();
			})(request, response);
	});

  //setting up routing -------------------------------------
	require('../app/routes/picture.routes')(app);
	require('../app/routes/event.routes')(app);
	require('../app/routes/channel.routes')(app);
	require('../app/routes/tag.routes')(app);
	require('../app/routes/provider.routes')(app);
	require('../app/routes/user.routes')(app);

	//end setting up routing -------------------------------------
 	app.use(express.static('./public'));


	return app;
}

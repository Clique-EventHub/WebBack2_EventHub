process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express= require('./config/express');
var mongoose = require('./config/mongoose');
var passport = require('./config/passport');
var updateCj = require('./config/updateCronjob');
var hotCj = require('./config/hotCronjob');
var notiCj = require('./config/notiCronjob');
var config = require('./config/config');


var db = mongoose();
var app = express();
var passport = passport();
var updateCronJob = updateCj();
var hotCronJob = hotCj();
var notiCronJob = notiCj();



app.listen(config.PORT);

console.log("Server is running at " +config.IP +":"+config.PORT);
console.log("Server mode: "+process.env.NODE_ENV);

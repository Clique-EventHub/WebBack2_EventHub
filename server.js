process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express= require('./config/express');
var mongoose = require('./config/mongoose');
var passport = require('./config/passport');
var updateCj = require('./config/updateCronjob');
var hotCj = require('./config/hotCronjob');
var config = require('./config/config');
var https = require('https');
var fs = require('fs');

var sslPath = '/etc/letsencrypt/live/www.cueventhub.com/';

var options = {
     key: fs.readFileSync('/path/to/privkey.pem'),
     cert: fs.readFileSync('/path/to/fullchain.pem'),
     ca: fs.readFileSync('/path/to/chain.pem')
}

var db = mongoose();
var app = express();
var passport = passport();
var updateCronJob = updateCj();
var hotCronJob = hotCj();


var server = https.createServer(app);

<<<<<<< HEAD
server.listen(config.PORT);
=======
app.listen(config.PORT, config.IP);
>>>>>>> 8614f58aaefeae78b7275eee3a4324873223d24d
console.log("Server is running at " +config.IP +":"+config.PORT);

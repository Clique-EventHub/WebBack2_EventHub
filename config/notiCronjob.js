var request = require('request');
var cronjob = require('cron').CronJob;
var config = require('./config');

module.exports = function(){
	var job = new cronjob('00 00 03 * * *', function() {
		request({
			uri:"http://"+config.IP+":"+config.PORT+"/update/notification",
			method: "get",
		}, function(error, response, body) {
		console.log('notification update at : '+Date());
		});
	}, null, true, 'Asia/Bangkok');
	return job;
}

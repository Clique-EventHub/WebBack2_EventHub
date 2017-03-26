var request = require('request');
var cronjob = require('cron').CronJob;
var config = require('./config');

module.exports = function(){
	var job = new cronjob('00 00 00 * * *', function() {
		request({
			uri:"http://"+config.IP+":"+config.PORT+"/update/perday",
			//uri:"localhost:1111/update/perday",
			method: "get",
		}, function(error, response, body) {
		console.log('perday:'+Date());
		});
	}, null, true, 'Asia/Bangkok');
	return job;
}

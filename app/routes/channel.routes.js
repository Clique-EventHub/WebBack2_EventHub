
module.exports = function(app){
	var channel = require('../controllers/channel.controllers');

	app.get('/channel/listall',channel.listAll);
	app.delete('/channel/clear',channel.clear);

	// chaining : same path different request , run different function
	app.route('/channel')		
		.get(channel.getChannel) // request with query "id"
		.post(channel.postChannel)
		.put(channel.putChannel)
		.delete(channel.deleteChannel);

	app.get('/channel/stat',channel.getStat);


	app.get('/channel/search',channel.searchChannel);

}

module.exports = function(app){
	var tag = require('../controllers/tag.controllers');
	app.post('/tags/modify',tag.modifyTag);
	app.get('/tags/search',tag.searchTag);	
	app.get('/tags',tag.getTags);
}
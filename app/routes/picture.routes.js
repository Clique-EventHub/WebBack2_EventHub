module.exports = function(app){
	var picture = require('../controllers/picture.controllers');

	app.post('/picture',picture.postPicture);
	app.delete('/picture',picture.deletePictureHandle);
 	app.route('/picture/:name')
		.get(picture.getPicture);
		
}

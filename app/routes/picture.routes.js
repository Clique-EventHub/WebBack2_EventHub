module.exports = function(app){
	var picture = require('../controllers/picture.controllers');

	app.post('/picture',picture.postPicture);
 	app.route('/picture/:name')
		.get(picture.getPicture)
		.post(picture.postPicture)
		.delete(picture.deletePicture);
}

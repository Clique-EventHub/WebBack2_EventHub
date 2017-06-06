module.exports =  function(app){
	let form = require('../controllers/form.controllers');
	
	app.route('/form')
		.get(form.getForm)
		.put(form.responseForm)
		.post(form.createForm)
		.delete(form.deleteForm);	
}

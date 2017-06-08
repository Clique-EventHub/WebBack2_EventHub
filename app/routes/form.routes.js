module.exports =  function(app){
	let form = require('../controllers/form.controllers');
	app.get('/listform',form.listall);	
	app.route('/form')
		.get(form.getForm)
		.put(form.responseForm)
		.post(form.createForm)
		.delete(form.deleteForm);	
	app.get('/clear',form.clearForm);
}

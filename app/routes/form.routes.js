module.exports =  function(app){
	let form = require('../controllers/form.controllers');
	if(process.env.NODE_ENV === "development"){
		app.get('/listform',form.listall);	
		app.get('/form/clear',form.clearForm);
	}
	
	app.route('/form')
		.get(form.getForm)
		.put(form.responseForm)
		.post(form.createForm)
		.delete(form.deleteForm);	
	
}

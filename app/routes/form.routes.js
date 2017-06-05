export default function(app){
	let form = ('../controllers/form.controllers');
	
	app.route('/form')
		.get(form.getForm)
		.put(form.responseForm)
		.post(form.createForm)
		.delete(form.deleteForm);	
}

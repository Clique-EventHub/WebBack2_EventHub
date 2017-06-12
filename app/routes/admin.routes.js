var admin = require('../controllers/admin.controllers');

module.exports  = function(app){
  
  app.put('/admin/event/add', admin.addAdminEvent);
  app.delete('/admin/event/delete', admin.deleteAdminEvent);
  app.put('/admin/channel/add', admin.addAdminChannel);
  app.delete('/admin/channel/delete', admin.deleteAdminChannel);

}

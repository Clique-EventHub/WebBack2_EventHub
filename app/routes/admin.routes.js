var admin = require('../controllers/admin.controllers');

module.exports  = function(app){

  app.put('/admin/event/add', admin.addAdminEvent);
  app.delete('/admin/event/delete', admin.deleteAdminEvent);
  app.put('/admin/channel/add', admin.addAdminChannel);
  app.delete('/admin/channel/delete', admin.deleteAdminChannel);
  app.put('/admin/check-in', admin.checkJoinPeopleIn);

  //====temporarily code while regId is not working=========

  app.put('/admin/event/addfb', admin.addAdminEventFB);
  app.delete('/admin/event/deletefb', admin.deleteAdminEventFB);
  app.put('/admin/channel/addfb', admin.addAdminChannelFB);
  app.delete('/admin/channel/deletefb', admin.deleteAdminChannelFB);

}

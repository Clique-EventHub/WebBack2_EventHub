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

  app.put('/admin/event/addmg', admin.addAdminEventMG);
  app.delete('/admin/event/deletemg', admin.deleteAdminEventMG);
  app.put('/admin/channel/addmg', admin.addAdminChannelMG);
  app.delete('/admin/channel/deletemg', admin.deleteAdminChannelMG);

  app.put('/admin/event/choose', admin.selectPending);
}

Meteor.startup(function () {  
  if (Meteor.isClient) {
    sAlert.config({
      effect: 'flip',
      position: 'top',
      timeout: 8000,
      html: false,
      onRouteClose: true,
      stack: false
    });
  }
});
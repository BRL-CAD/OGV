Meteor.startup(() => {
  sAlert.config({
    effect: "genie",
    position: "top-right",
    timeout: 5000,
    html: false,
    onRouteClose: false,
    stack: true,
    offset: 0,
    beep: {
      info: "/itsok.wav",
      error: "/error.wav",
      success: "/itsok.wav",
      warning: "/error.wav"
    }
  });
});

import "./menu_new.html";
import "./menu_new.css";
import "./notifications.js";

Template.newMenu.helpers({
  activeIfTemplateIs(template) {
    const currentRoute = Router.current().route.getName();
    return currentRoute && template === currentRoute ? "active" : "";
  },
  toggle() {
    console.log("i runned");
  }
});

Template.newMenu.events({
  "click #log-out": function() {
    Meteor.logout(() => {
      sAlert.info("Bye!, See you back soon");
      Router.go("/");
    });
    return false;
  },
  "click #notification-button": function(e) {
    const notificationButton = $(e.target);
    $(".notifications").slideToggle("fast");
    $(".notifications").css(
      "top",
      notificationButton.offset().top + notificationButton.outerHeight() + 8
    );
  },
  "click #navToggle": function() {
    $(".nav").toggleClass("nav--open");
  }
});

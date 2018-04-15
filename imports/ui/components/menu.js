/*                     M E N U . J S
 * BRL-CAD
 *
 * Copyright (c) 1995-2013 United States Government as represented by
 * the U.S. Army Research Laboratory.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License
 * version 2.1 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this file; see the file named COPYING for more
 * information.
 */

/**
 * @file OGV/client/views/menu.js
 * Helpers and events for primary menu
 */

import "./menu.html";
import "./notifications.js";

Template.menu.events({
  "click #notification-icon": function() {
    $(".user-menu").slideUp("fast");
    $(".notifications").slideToggle("fast");
  },

  "click #user": function() {
    $(".notifications").slideUp("fast");
    $(".user-menu").slideToggle("fast");
  },

  "click .um-item": function() {
    $(".user-menu").slideUp("fast");
  },

  "click #log-out": function() {
    Meteor.logout(() => {
      sAlert.info("Bye!, See you back soon");
      Router.go("/");
    });
    return false;
  }
});

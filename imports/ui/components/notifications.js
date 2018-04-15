/*                     N O T I F I C A T I O N S . J S
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
 * Returns all the notifications that are in the database
 */

import "./notifications.html";

Template.notifications.helpers({
  notifications() {
    allNotifications = Notifications.find(
      {
        ownerId: Meteor.userId(),
        seen: false
      },
      {
        sort: {
          timeNotified: -1
        }
      }
    );
    count = allNotifications.count();
    if (count === 0) {
      return false;
    }
    return allNotifications;
  }
});

Template.notification.helpers({
  message() {
    _id = this.user;
    username = Meteor.users.findOne(_id).profile.name;
    if (this.type === "love") {
      message = `${username} loved your model`;
    } else if (this.type === "comment") {
      message = `${username} commented on your model`;
    } else if (this.type === "share") {
      message = `${username} shared your model`;
    }
    return message;
  },
  icon() {
    if (this.type === "love") {
      icon = "/icons/love.png";
    } else if (this.type === "comment") {
      icon = "/icons/Chat.png";
    } else if (this.type === "share") {
      icon = "/icons/Chat.png";
    }
    return icon;
  }
});

Template.notification.events({
  "click .notification-anchor": function() {
    $(".notifications").slideUp();
    Notifications.update(this._id, {
      $set: {
        seen: true
      }
    });
  }
});

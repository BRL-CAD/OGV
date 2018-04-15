/*                P U B L I C A T I O N S . J S
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

/** @file OGV/server/publications
 *  @brief publishes data from server to client
 */

Meteor.publish("modelFiles", () => ModelFiles.find());

Meteor.publish("objFiles", () => OBJFiles.find());

Meteor.publish("mtlFiles", () => MTLFiles.find());

Meteor.publish("comments", () => Comments.find());

Meteor.publish("profilePictures", () => ProfilePictures.find());

Meteor.publish("lovers", () => Lovers.find());

Meteor.publish("ogvSettings", () => OgvSettings.find());

Meteor.publish("sharedModels", () => SharedModels.find());

Meteor.publish("notifications", () => Notifications.find());

Meteor.publish("posts", () => Posts.find());

/**
 * Not every detail about user is published to client
 * for security reasons
 */
Meteor.publish("profiles", () =>
  Meteor.users.find(
    {},
    {
      fields: {
        emails: 1,
        profile: 1,
        roles: 1
      }
    }
  )
);

Meteor.publish("userProfile", id => {
  check(id, String);
  return Meteor.users.find(id);
});

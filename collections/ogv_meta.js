/*                     O G V _ M E T A . J S
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

/** @file OGV/collections/ogv_meta.js
 *  @brief Collections for site wide settings.
 *
 */

OgvSchema = new SimpleSchema({
  gobjPath: {
    type: String
  },
  mailUrl: {
    type: String
  },
  mgedPath: {
    type: String
  },
  siteName: {
    type: String
  },
  settingSwitch: {
    type: Boolean
  },
  landingPageModel: {
    type: String
  }
});

OgvSettings = new Meteor.Collection("OgvSettings");
OgvSettings.attachSchema(OgvSchema);
/**
     * No one is allowed to insert and only admin can update the settings
     */

OgvSettings.allow({
  insert() {
    throw new Meteor.Error(
      550,
      "You are not allowed to insert new settings, you can edit the old ones though"
    );
  },
  update() {
    roles = Meteor.user().roles;
    let isAdmin = false;

    for (role in roles) {
      if (roles[role] === "admin") {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      throw new Meteor.Error(
        550,
        "Sorry you need to be admin before you can edit site settings"
      );
    }

    return isAdmin;
  }
});

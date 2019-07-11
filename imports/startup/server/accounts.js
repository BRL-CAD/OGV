/*                   A C C O U N T S . J S
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

/** @file OGV/server/accounts.js
 *  @brief file for email validation configuration
 *
 *  This file  serves two purposes. Firstly it contains configuration
 *  regarding sending email for the purpose of validating the new
 *  registered user. After verification  one can upload their models,
 *  and use OGV.
 */

/**
 * Create a test user without admin roles and a super user with
 * admin roles on a fresh install (when number of users is zero)
 */

//Generating 8 Length Alphanumeric Password.
function passwordGen(len){
    var text = " ";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
  text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

//Applying Password to Meteor Admin User Settings and Logging to Server.
var randomPassword = passwordGen(8)

//User ID for Admin is currently bMfEoAFqu4EibGwtH
console.log("Admin Password:" + Meteor.settings.adminPassword);
Accounts.setPassword("bMfEoAFqu4EibGwtH",randomPassword)


Accounts.config({
  sendVerificationEmail: true
  //forbidClientAccountCreation: false
});

if (Meteor.users.find().fetch().length === 0) {
  const users = [
    {
      name: "Test User",
      email: "normal@example.com",
      roles: []
    },
    {
      name: "Super User",
      email: "admin@example.com",
      roles: ["admin"]
    }
  ];

  

  const Bio = "greatest 3d modeller on the planet";
  _.each(users, userData => {
    const password = randomPassword;
    const id = Accounts.createUser({
      email: userData.email,
      password: password,
      profile: {
        name: userData.name,
        bio: Bio
      }
    });

    // email verification
    Meteor.users.update(
      {
        _id: id
      },
      {
        $set: {
          "emails.0.verified": true
        }
      }
    );

    Roles.addUsersToRoles(id, userData.roles);
  });
}

Accounts.onCreateUser((options, user) => {
  const followingArray = [];
  // followingArray[0] = user._id;
  const adminUser = Meteor.users.findOne({
    "roles.0": "admin"
  });
  followingArray[0] = adminUser._id;
  followingArray[1] = user._id;

  if (options.profile) {
    options.profile.following = followingArray;
    user.profile = options.profile;
  } else {
    console.log(options);
  }

  return user;
});

/* Meteor.users.allow({
    update: function(userId, user, fields)
    {
        if (!fields.isEqualTo(['profile.following', 'profile.follower'])) {
            return false;
        } else {
            return true;
        }
    }
});
*/

/**
 *  Need to allow the users to update only the follwers array of other users
 */
Meteor.users.allow({
  update() {
    return true;
  }
});

/**
 * Intended to Delete/Remove users who have not verified their Emails in hrs hours
 */
const hrs = 1;
Meteor.setInterval(() => {
  Meteor.users
    .find({
      "emails.0.verified": false
    })
    .forEach(user => {
      // Do action with 'user' that has not verified email for 1 hour
      Meteor.users.remove(
        {
          _id: user._id
        },
        true
      );
    });
}, 3600000 * hrs);

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


//Account Configuration (OGV)
Accounts.config({
  sendVerificationEmail: true
  //forbidClientAccountCreation: false
});

//Generating Admin Password 8 Length Alphanumeric Password.
function passwordGen(len){
    var text = " ";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
  text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

//Initializing Admin User Password in Console and Initializing Users if none are present.
if (Meteor.users.find().fetch().length !== 0) {

  console.log("Initial Users Have Already Been Created.");

}
else if(Meteor.users.find().fetch().length === 0) {

  //Initializing Admin Super User, Initializing Test User.
  console.log("Creating Initial Users");
  const Bio = "Computer Aided Design Product Engineer";

  //User Data for Initialization of users.
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

 
  //Initialize Users with above userData.
  _.each(users, userData => {

    const id = Accounts.createUser({
      email: userData.email,
      password: Meteor.settings.adminPassword,
      profile: {
        name: userData.name,
        bio: Bio
      }
    });

    //Setting Email Verification Status.
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

//Find Admin User ID.
var adminUser = Accounts.findUserByEmail("admin@example.com");

//Creating Admin Password.
var adminPassword = Meteor.settings.adminPassword;
var randomPassword = passwordGen(8);
var newPassword = randomPassword.substring(1);

//Applying Password to Meteor Admin User
if(Meteor.settings.adminPassword==="password"){
  //Apply New Password to Meteor Admin User
  Accounts.setPassword(adminUser,newPassword);
  console.log("Admin Email: " + "admin@example.com");
  console.log("Admin Password: " + newPassword);
}
else{
  //Apply Meteor Settings Password to Meteor Admin User
  Accounts.setPassword(adminUser,adminPassword);
  console.log("Admin Email: " + "admin@example.com");
  console.log("Admin Password: " + adminPassword);
}


//Applying Meteor Settings and Password, Logging to Server.
Accounts.onCreateUser((options, user) => {
  const followingArray = [];
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

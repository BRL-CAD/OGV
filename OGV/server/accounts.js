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

Accounts.config({
  sendVerificationEmail: true
});

/**
 * Create a test user without admin roles and a super user with 
 * admin roles on a fresh install (when number of users is zero)
 */


if (Meteor.users.find().fetch().length === 0) {
    var users = [
	{name:"Test User",email:"normal@example.com",roles:[]},
	{name:"Super User",email:"admin@example.com",roles:['admin']}
    ];

	var Bio = "greatest 3d modeller on the planet";
    _.each(users, function (userData) {
	var id,
	    user; 

	id = Accounts.createUser({
	    email: userData.email,
            password: "ogv123",
            profile: { name: userData.name, bio: Bio, pic: false }
	});

	// email verification
	Meteor.users.update({_id: id}, {$set:{'emails.0.verified': true}});
	Roles.addUsersToRoles(id, userData.roles);
    
    });
}
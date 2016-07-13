/*                     S I G N U P . J S
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

/** @file OGV/client/views/signup.js
 *  @brief Deals with registration of new user
 *
 */
Template.signUp.events({
    'submit #sign-up-form': function(e,t)
    {
	e.preventDefault();

    var signUpForm = $(e.currentTarget),
    email = trimInput(signUpForm.find('#sign-up-email').val().toLowerCase()),
    password = signUpForm.find('#sign-up-password').val(),
    passwordConfirm = signUpForm.find('#sign-up-password-confirm').val(),
    username = signUpForm.find('#sign-up-username').val();

    /**
     * Validates the sign up form fields and gives errors if any 
     */

    if (isNotEmpty(email) && 
	isNotEmpty(password) &&
	isNotEmpty(username) &&
	isEmail(email) &&
	areValidPasswords(password, passwordConfirm)) {
        Accounts.createUser({email:email, password:password, profile: { name: username ,bio: "Greatest 3d modeller on the planet" }},function(err){
	    if (err) {
		throwError(err.reason);
	    } else {
		throwNotification('Congrats! Check your inbox at ' + email + ' to verify it');
	    }
	});
    }
	return false;	
    },
});	

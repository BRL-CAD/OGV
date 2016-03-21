/*                     M A I N . J S
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

/** @file OGV/client/main.js
 *  @brief helper file for index.html
 *
 *  Helper for main template (index.html) that checks for the reset 
 *  and verify email tokens. It also takes care of the display of
 *  forgot password form.
 */

/** 
 * index.html helper
 *
 * Helper function for the template index.html that returns the
 * session variable resetPasswordToken which is set in function
 * @return reset password token
 */
   
Template.models.helpers({
    resetPasswordToken: function()
    {
	return Session.get('resetPasswordToken');
    }
});

/**
 * Sets reset password token.
 *
 * Checks for reset password token in the url and sets the session
 * variable resetPasswordToken accordingly. Such token shall be 
 * sent to user's email-id along with the link. 
 */
if (Accounts._resetPasswordToken) {
    Session.set('resetPasswordToken', Accounts._resetPasswordToken);
}

/**
 * Verifies email 
 *
 * It checks if verify email token is set or not and verifies the 
 * email ID accordingly. Such token shall be sent to user's email-id
 * along with a "verify your email" link.
 */ 
if (Accounts._verifyEmailToken) {
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
	if (err) {
	    Session.set('alert',err.message);
	} else {
	    Session.set('alert','Your email is verified');
	}
    });
}

/**
 * Subscribe to various collections
 *
 */
Meteor.subscribe('objFiles');
Meteor.subscribe('thumbFiles');
Meteor.subscribe('comments');
Meteor.subscribe('lovers');
Meteor.subscribe('profilePictures');
Meteor.subscribe('ogvSettings');
Meteor.subscribe('profiles');

/*                                                                    
 * Local Variables:                                                   
 * mode: javascript                                                            
 * tab-width: 8
 * End:                                                               
 * ex: shiftwidth=4 tabstop=8                                         
 */

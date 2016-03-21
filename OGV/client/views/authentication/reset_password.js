/*                     R E S E T _ P A S S W O R D . J S
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

/** @file OGV/client/views/reset_password.js
 *  @brief Deals with resetting password
 *
 *  This view normally shows up when user has applied for the forgotten
 *  password form 
 */
Template.resetPassword.events({
    'submit #reset-password-form': function(e,t)
    {
	e.preventDefault();

	var resetPasswordForm = $(e.currentTarget),
	    password = resetPasswordForm.find('#reset-password-password').val(),
	    passwordConfirm = resetPasswordForm.find('#reset-password-confirm').val();

        /**
 	 * Validate the password fields and show errors if any 
	 */
	
	if (isNotEmpty(password) &&
	    areValidPasswords(password,passwordConfirm)) {
	    Accounts.resetPassword(Session.get('resetPasswordToken'),password,function(err)
	    {
		if (err) {
			sAlert.error('We\'re sorry but something went wrong', {effect: 'flip', onRouteClose: false, stack: false, timeout: 3000, position: 'top'});
		} else {
		    sAlert.success('Your password has been changed. Welcome back!', {effect: 'flip', onRouteClose: false, stack: false, timeout: 3000, position: 'top'});
		    Session.set('resetPassword',null);
		}
	    });
	}
	return false;
    }
});

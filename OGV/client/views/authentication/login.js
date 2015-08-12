/**
/*                    	L O G I N . J S
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

/** @file OGV/client/views/authentication/login.js
 *  @brief Helper for login.html
 *
 * authenticate user credentials, shows the errors if any
 */

Template.logIn.events({
    'submit #log-in-form':function(e,t)
    {
	e.preventDefault();

	var logInForm = $(e.currentTarget),
	    email = trimInput(logInForm.find('#log-in-email').val().toLowerCase()),
	    password = logInForm.find('#log-in-password').val();
        
     /**
 	 * If login fails show the error message else go to /upload 
	 */

	if (isNotEmpty(email) &&
	    isEmail(email) &&
	    isNotEmpty(password) &&
	    isValidPassword(password)) {
	    Meteor.loginWithPassword(email,password,function(err){
	        if (err) {
		    sAlert.error(err.reason);
		    console.log(err);
		} else {
			sAlert.info('Welcome back', {effect: 'flip', onRouteClose: true, stack: false, timeout: 3000, position: 'top'});
		    Router.go('/upload');
		}
	    });
	}

	return false;
	
    },
	
	/**
	* Things done after clicking on google image on login.html
	*/
    'click img#loginGoogle': function(e, t) 
    {
    e.preventDefault();
    
    Meteor.loginWithGoogle(function(err){
        requestOfflineToken: 'true'
        if(err) {
        	throwError(err.reason);
        	console.log(err);
        } else {
        	sAlert.info('Welcome back', {effect: 'flip', onRouteClose: true, stack: false, timeout: 3000, position: 'top'});
        	Router.go('/upload');
		}
	});
	},

	/**
	 * Things done after clicking on github image on login.html
	*/
	'click img#loginGithub': function(e, t) 
    {
    e.preventDefault();
    
    Meteor.loginWithGithub(function(err){
        requestOfflineToken: 'true'
        if(err) {
        	throwError(err.reason);
        	console.log(err);
        } else {
        	sAlert.info('Welcome back', {effect: 'flip', onRouteClose: true, stack: false, timeout: 3000, position: 'top'});
        	Router.go('/upload');
		}
	});
	},

	/**
	 * Things done after clicking on facebook image on login.html
	*/
	'click img#loginFacebook': function(e, t) 
    {
    e.preventDefault();
    
    Meteor.loginWithFacebook(function(err){
        requestOfflineToken: 'true'
        if(err) {
        	throwError(err.reason);
        	console.log(err);
        } else {
        	sAlert.info('Welcome back', {effect: 'flip', onRouteClose: true, stack: false, timeout: 3000, position: 'top'});
        	Router.go('/upload');
		}
	});
	}

});	    

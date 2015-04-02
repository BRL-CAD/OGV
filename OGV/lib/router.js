/*                   R O U T E R . J S
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
 * @file OGV/lib/router.js
 * @brief connects URLs to views, handles routing of the application
 *
 * Meteor is basically meant for single page apps but that does not 
 * mean that we cannot have urls to bookmark our favorite models. Using
 * package named Iron Router, routing of OGV is handled.
 */

/**
 * Configurations that are applied globally to all the routes.
 */

Router.configure({
    layoutTemplate:'layout',
    loadingTemplate:'preloader',
    waitOn: function() { return Meteor.subscribe('modelFiles'); },
});


/**
 * Mapping urls to template names
 */
Router.map(function() {
    this.route('index', {
	path : '/'	
    });
    this.route('signUp', {path : 'sign-up'});
    this.route('logIn', {path : 'log-in'});
    this.route('cfsUploader', {path : 'upload'});
    this.route('notVerified', {path : 'not-verified'});
    this.route('forgotPassword', {path : 'forgot-password'});
    this.route('dashboard',{
	path: 'dashboard',
	waitOn: function() {
	    return Meteor.subscribe('ogvSettings');
	}
    });
    this.route('modelViewer', {
	path: '/models/:_id',
	data: function() 
	{ 
	    return ModelFiles.findOne (this.params._id);
	},
	action : function () {
   	     if (this.ready()) this.render();
	}
    });

    this.route('modelMeta', {
	path: '/description/:_id',
	data: function() 
	{
	    return ModelFiles.findOne(this.params._id);
	}
    });

    this.route('filemanager',{
	path: '/my-models',
	data: function()
	{
	    return ModelFiles.find({'owner' : Meteor.user()});
	}
    });
});


/**
 * Some routes are shown only when user has a valid email 
 * address
 */
var validateUser = function(pause) {
    if (Meteor.user()) {
	if (Meteor.user().emails[0].verified) {
	    this.next();
	}
	 else {
	    this.render('notVerified');
        }
    } else if (Meteor.loggingIn()) {
	this.render('preloader');
    } else {
	this.render('logIn');
    }
}


/**
 * actionReady shows a route only after it has fetched all
 * the required data. 
 */
var actionReady = function(pause) 
{
    if (this.ready()) {
	this.next();
    } else {
	this.render('preloader');
    }
}

/**
 * While the user is still logging in, all the routes should
 * show a preloader
 */
var loggingIn = function(pause) {
    if (Meteor.loggingIn()) {
	this.render('preloader');
    }
    else {
	this.next();
    }
}

/**
 * Remove notifactions and error messages that have been seen
 * everytime a route is changed 
*/
Router.onBeforeAction(function() { clearNotifications(); this.next(); });
Router.onBeforeAction(validateUser,{only:['cfsUploader','filemanager','dashboard','modelMeta']});
Router.onBeforeAction(actionReady, {only:['index', 'modelViewer']});
Router.onBeforeAction(loggingIn);

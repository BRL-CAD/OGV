/*                     M E N U . J S
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
 * @file OGV/client/views/menu.js
 * Helpers and events for primary menu 
 */

Template.menu.events({
    'click #log-out':function(e,t)
    {
	Meteor.logout(function() {
	    sAlert.info('Bye!, See you back soon', {effect: 'flip', onRouteClose: false, stack: false, timeout: 4000, position: 'top'});     
		Router.go("/");
	});
	
	return false;
    }
});

Template.menu.helpers({
	/**
	* returning logged in user's information 
	*/
	userId: function()
	{
		var currentUser = Meteor.user();
		return currentUser._id;
	}
})

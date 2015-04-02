/*                     N O T I F I C A T I O N S . J S
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
 * Create a new collection, that exists just on the client side
 */
Notifications = new Meteor.Collection(null);

/**
 * throwNotification shows success messages, and are displayed
 * with green background in browser.
 */
throwNotification = function(message) 
{
    Notifications.insert({message:message, seen:false, error:false});
    setTimeout(function(){clearNotifications();}, 2000);
}


/**
 * throwError shows a failure message, and is displayed with
 * red background in browser
 */
throwError = function(message)
{
    Notifications.insert({message:message, seen:false, error:true});
    setTimeout(function(){clearNotifications();}, 2000);
}


/**
 * When the notifications (errors and success messages) have
 * been seen and usually during change of the router, they are
 * deleted from the local database that's on the client.
 */
clearNotifications = function()
{
    Notifications.remove({seen: true});
}


/**
 * Returns all the notifications that are in the local database
 */
Template.notifications.helpers({
    notifications : function()
    {
    return Notifications.find();
    }
});


/** 
 * When notification message is rendered aka, shown on the screen. After
 * a moment, seen property of that is set to true. That way the messages
 * with seen:true can be removed from the database during change in route
 */
Template.notification.rendered = function()
{
    var notification = this.data;
    Meteor.defer(function() {
    Notifications.update(notification._id, {$set: {seen: true}});
    });
}        

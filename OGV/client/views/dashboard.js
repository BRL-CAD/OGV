/*                     D A S H B O A R D . J S
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
 * @file OGV/client/views/dashboard.js
 * @brief helpers and events for user/admin dashboard (dashboard.html)
 *
 * dashboard is place where normal users and admins can edit their
 * settings. This file contains logic required for dashboard
 */

Template.dashboard.events({
    /**
     * When user form is submitted, upload the picture and save
     * the settings 
     */
    'submit #dash-user-form' : function(e, t) 
    {
  e.preventDefault();

  var userDash = $(e.currentTarget),
      userBio = userDash.find('#dash-short-bio').val(),
      userName = userDash.find('#dash-username').val();
      
  var currentUser = Meteor.user();

	var saveSettings = function(picId)
	{   
 	    /**
	     * If user has not changed the profile picture then use
	     * existing profile pic.
	     */
	    if (!picId) {
		picId = currentUser.profile.pic;
	    } 

	    Meteor.users.update( currentUser._id,{ $set: {'profile.bio' : userBio, 'profile.name': userName, 'profile.pic': picId}}, function(error, res) {
		if (error) {
		    throwError(error.reason);
	    	} else {
		    /*throwNotification("Settings saved");*/
        sAlert.info('Settings saved', {effect: 'flip', onRouteClose: true, stack: false, timeout: 3000, position: 'top'});
		}
	    });
	}
	
	if (e.target[2].files[0]) {
	    var fsFile = new FS.File(e.target[2].files[0]);
	    console.log(fsFile);
      var currentUser = Meteor.user();
	    fsFile.user = currentUser._id;
      fsFile.userCreatedAt = currentUser.createdAt;

		var prevProfilePicture = ProfilePictures.findOne({user: currentUser._id});
		if(typeof prevProfilePicture != 'undefined'){
	   		ProfilePictures.remove(prevProfilePicture._id);
	   	}

	    ProfilePictures.insert(fsFile, function(err, dpFile) {
		if (err) {
		    throwError(err.reason);
	    	} else {
		    /*throwNotification('Profile pic uploaded');*/
        sAlert.info('Profile pic uploaded', {effect: 'flip', onRouteClose: true, stack: false, timeout: 3000, position: 'top'});
	    	    saveSettings(dpFile._id);
		} 
	    });
	} else {
	    saveSettings();
	}
  },

    /**
     * When admin form is submitted, get the values form the form
     * and update the settings.
     */
    'submit #dash-admin-form' : function(e,t) 
    {
  e.preventDefault();
  
  var adminDash = $(e.currentTarget),
      primaryBranding = adminDash.find('#dash-primary-branding').val(),
      mailUrl = adminDash.find ('#dash-mail-url').val(),
      mgedPath = adminDash.find('#dash-mged-path').val(),
      gobjPath = adminDash.find('#dash-g-obj-path').val();
  
  settings = OgvSettings.findOne();

  OgvSettings.update( settings._id, { 
      $set: { 
    siteName: primaryBranding, 
    mailUrl : mailUrl, 
    mgedPath : mgedPath, 
    gobjPath :gobjPath 
      }
  }, function(error, res) {
      if (error) {
    sAlert.error(error.reason, {effect: 'flip', onRouteClose: false, stack: false, timeout: 3000, position: 'top'});
      } else {
    sAlert.success("Admin Settings saved", {effect: 'flip', onRouteClose: false, stack: false, timeout: 3000, position: 'top'});
      }
  }); 
    }
});

Template.dashboard.helpers({
	/**
 	* profilePic returns the url of profile picture of the user
 	*/
    profilePic : function() 
    {
	var currentUser = Meteor.user();
	var picId = currentUser.profile.pic;
	console.log(picId);	
	if( currentUser.services.google ){
		return currentUser.services.google.picture;
	} else {
		return ProfilePictures.findOne(picId).url();
	}
    },

    thisUser: function()
    {
    	return Meteor.user();
    },

    settings: function() 
    {
  return OgvSettings.findOne();
    }
});

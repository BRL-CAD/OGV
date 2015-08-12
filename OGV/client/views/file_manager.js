/*                     F I L E _ M A N A G E R . J S
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

/** @file OGV/client/views/file_manager.js
 *  @brief Helper for filemanager.html
 *
 *  Searches for all the models that belong to the current user and 
 *  returns them.
 */


Template.filemanager.helpers({
    models: function() 
    {
	model = ModelFiles.find({'owner' : Meteor.userId()}, {sort:{timeUploaded:-1}});
    if (model.count()) 
    {
    	return model;
    } else {
    	return false;
    }
    }
});

Template.filemanager.events({
	"click #deleteModel": function() 
	{
		var txt;
		var r = confirm("Are you sure, you want to delete your model?");
		if (r == true) {
			//Removing both ThumbFiles and ModelFiles associated with the give model id
		    var model = ModelFiles.findOne(this._id);
		    var prevThumbnail = ThumbFiles.findOne(model.thumbnail);
		    //In case model is not without a thumbnail
		    if(typeof prevThumbnail != 'undefined'){
				ThumbFiles.remove(model.thumbnail);
    		}
					    
		    ModelFiles.remove(model._id);
		    Meteor.users.update({_id: model.owner}, {$inc: {"profile.countModels": -1}});
		    /*throwNotification("Model permanently deleted");*/
		    sAlert.info('Model permanently deleted', {effect: 'flip', onRouteClose: true, stack: false, timeout: 3000, position: 'top'});
		}
  	}
});

/*                     M O D E L _ F E E D . J S
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
 * @file OGV/client/views/model_feed.js
 * @brief helpers and events for model feed
 *
 * Model Feed is a place where all the models by all the users are shown.
 * Model Feed is comprised of Model Posts, each Model Post is for one 
 * model and further has Model View that shows representative image of the
 * model in model feed. Apart from these 3 sub parts model feed also contain
 * various social elements which are taken care of in other files such as
 * OGV/clients/views/social.js 
 */
Template.modelFeed.helpers({
    /**
     * models helper finds all the models from the database and then sorts
     * them in reverse chronological order. 
     */
    models: function() 
    {
	model = ModelFiles.find({}, {sort:{timeUploaded:-1}});
	if (model.count()) {
	    return model;
	} else {
	    return false;
	} 
    }
});


Template.modelPost.helpers({
    /**
     * returns image of the user from database, if there's no image a default
     * image is shown.
     */
    userImg: function()
    {
	modelOwner = Meteor.users.findOne(this.owner);
	picId = modelOwner.profile.pic;
	pic = ProfilePictures.findOne(picId);
	picUrl = pic.url();
	if (pic) {
	    return picUrl;
        } else {
	    return '/public/profile-pic.jpg';
	}
    },
    owner: function()
    {
	return Meteor.users.findOne(this.owner);
    }
});
    

Template.modelView.helpers({
    thumbImg:function()
    {
        thumbImage = ThumbFiles.findOne({gFile:this._id});
        return thumbImage;  
    }
});

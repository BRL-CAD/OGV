/*                     P R O F I L E . J S
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

/** @file OGV/collections/profile.js
 *  @brief Collections required for user profiles
 *
 */


ProfilePictures = new FS.Collection('profilePictures',  {
    stores: [
	new FS.Store.FileSystem("profilePictures")
    ],
    filter: {
	allow: {
	    contentTypes: ['image/png', 'image/jpeg', 'image/jpg']
	}
    }	
});


/**
 * Only the owner can edit or add his pic, but anyone can
 * download/ view the image.
 */

ProfilePictures.allow({
    insert: function(userId, file) 
    {
	return userId == file.user;
    },
    update: function(userId,file) 
    {
	return userId == file.user;
    },
    download: function(userId, file) 
    {
    	return true;
    },
    remove: function (userId, file) {
        return userId && file.user === userId;
    }
});

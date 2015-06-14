/**                     M O D E L _ M E T A . J S
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
 * @file OGV/client/views/model_meta.js
 *
 * Helpers and events for editing models.
 */

/**
 * Update information about model
 *
 * Each model has some information associated with it, it can be name
 * bio or a representative image. Whenever user uploads he gets an option
 * to edit this information.
 */

Template.modelMeta.events({
    'submit #uploader-form': function(e, t)
    {
	e.preventDefault();
	
	var modelMetaForm = $(e.currentTarget),
	    filename = modelMetaForm.find('#desc-filename').val().toLowerCase(),
	    description = modelMetaForm.find('#desc-about').val(),
	    thumbnail,
	    modelId = modelMetaForm.find('#model-id').val();
	    
	/**
	* Adding the checkd boxes to an array named category
	*/
	var category = Array();
	$("input:checkbox[name=category]:checked").each(function(){
    	category.push($(this).val());
	})

	file = $('#desc-model-thumb')
	
	var fsFile = new FS.File(e.target[2].files[0]);
<<<<<<< HEAD
	fsFile.gFile = modelId;      
        	
=======
	fsFile.gFile = modelId;

	/**
	* Delete any thumbnail association with the model.
	* Thumbnail will be deleted before updating
	* No thumbnail deletion will happen if there is no thumbnail present yet.
	*/
    var currentModel = ModelFiles.findOne(modelId);	
    var prevThumbnail = ThumbFiles.findOne(currentModel.thumbnail);
    if(typeof prevThumbnail != 'undefined'){
		ThumbFiles.remove(currentModel.thumbnail);
    }

>>>>>>> origin/edit-info
	ThumbFiles.insert(fsFile,function(err,thumbFile) {
	    if (err) {
		throwError(err.reason);
	    } else {
<<<<<<< HEAD
		throwNotification("Image has been Uploaded" );
		throwNotification(category);
		ModelFiles.update(modelId, {$set: {name: filename, about: description, thumbnail:thumbFile._id, categories: category}}, function(error, res) {
		    if (error) {
			throwError(error.reason);
		    } else {
			throwNotification("Data about model has been saved");
		    }
		});
  
	    }
	}); 
    }
});
=======
			throwNotification("Thumbnail Image has been Uploaded" );
			ModelFiles.update(modelId, {$set: {name: filename, about: description, thumbnail:fsFile._id}}, function(error, res) {
			    if (error) {
				throwError(error.reason);
			    } else {
				throwNotification("Data about model has been saved");
			    }
			});
			Router.go('/my-models');
	  		throwNotification("Data about model has been saved");
	    }
	}); 
	}    
});
>>>>>>> origin/edit-info

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
	 a = e;
	var modelMetaForm = $(e.currentTarget),
	    filename = modelMetaForm.find('#desc-filename').val().toLowerCase(),
	    description = modelMetaForm.find('#desc-about').val(),
	    modelId = modelMetaForm.find('#model-id').val(),
	    audience = modelMetaForm.find('#desc-audience').val(),
	    currentUser = Meteor.user();
	    
	/**
	* Adding the checkd boxes to an array named category
	*/
	var category = Array();
	$("input:checkbox[name=category]:checked").each(function(){
    	category.push($(this).val());
	});

	var currentModel = ModelFiles.findOne(modelId);		

	ModelFiles.update(modelId, {$set: {name: filename, about: description, audience: audience}}, function(error, res) {
	    if (error) {
			sAlert.error(error.reason);
	    } else {
			sAlert.success("Data about model has been saved");
	    }
	});
	Posts.insert({
		postType: "posted",
		postedAt: currentModel.timeUploaded,
		postId: modelId,
		postedBy: currentUser._id,
		audience: audience
	});
	if(category.length > 0){
		ModelFiles.update(modelId, {$set: {categories: category}}, function(error, res) {
	    if (error) {
	    	sAlert.error(error.reason);
	    } else {
			sAlert.success("Data about model has been saved");					
	    }
	});
	}

	var uploadedModel = ModelFiles.findOne(modelId);
	if( uploadedModel.converted ){
		Router.go('/models/'+uploadedModel._id);
		sAlert.success("Data about model has been saved");
	} else {
		ModelFiles.remove(uploadedModel._id);
		Router.go('/upload');
		sAlert.success("There was some error in converting your uploaded file");
	}
		 

		    
}
});		

Template.modelMeta.helpers({
    'progressValue': function(){
	        var id = $('#model-id').val(),
		modelObj = ModelFiles.findOne({_id: id});
		var value = modelObj.conversion;
		value = parseInt(value, 10);
		if(value == null) value = 0;
		if(value >= 70) {
			$('progress[value]').css('display', 'none');
			$('.progress-label').css('display', 'none');
			$('#save-btn').css('display', 'block');
			return value;
		} else {
		return value;
		}
	}
});

/**
* helper to display already present categories in the model
* Diplayed everytime when the /description/:_id page is viewed
* Displays nothing if categories is empty.
*/
Template.modelMeta.modelCategory = function() 
{
    var id = Session.get('modelId');
    return ModelFiles.findOne({_id: id}); 
};

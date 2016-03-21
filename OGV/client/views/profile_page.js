Template.profilePage.events({
	'click #followButton': function(e, t)
	{
		var parts = location.href.split('/');
		var otherId = parts.pop(); //id of user whose page is being visited
		var currentUser = Meteor.user(); //user who is using OGV at that moment		
		
		//updates "following" array of currentUser
		Meteor.users.update(currentUser._id, {$addToSet: {"profile.following": otherId}}, function(error, res) {
		    if (error) {
			sAlert.error(error.reason);
		    } else {
		    //updates "follower" array of other user
		    Meteor.users.update(otherId, {$addToSet: {"profile.follower": currentUser._id}}, function(error, res) {
		    /*Meteor.users.update(otherId, {$addToSet: {"profile.follower": currentUser._id}}, function(error, res) {*/
		    	if (error) {
		    		sAlert.error(error.reason);
		    	} else {
		    		sAlert.success("You are now following this user", {effect: 'flip', onRouteClose: false, stack: false, timeout: 4000, position: 'top'});
			    }
			});
		    }
		});
	}, 

	'click #unfollowButton': function(e, t)
	{
		var parts = location.href.split('/');
		//id of user whose page is being visited
		var otherId = parts.pop(); 
		
		var currentUser = Meteor.user(); //user who is using OGV at that moment

		//updates "following" array of currentUser
		Meteor.users.update(currentUser._id, {$pull: { "profile.following": otherId }}, function(error, res) {
		    if (error) {
			sAlert.error(error.reason);
		    } else {
		    //updates "follower" array of other user
			Meteor.users.update(otherId, {$pull: {"profile.follower": currentUser._id}}, function(error, res) {
		    	if (error) {
					sAlert.error(error.reason);
		    	} else {
					sAlert.success("You are no longer following this user", {effect: 'flip', onRouteClose: false, stack: false, timeout: 4000, position: 'top'});
			    }
			});
		    }
		});		
	}
});


Template.profilePage.helpers({
    /**
     * returns image of the user from database, if there's no image a default
     * image is shown.
     */
    userImg: function() 
    {
	var parts = location.href.split('/');
	var otherId = parts.pop(); //id of user whose page is being visited
	var currentProfile = Meteor.users.findOne(otherId);
	var picId = currentProfile.profile.pic;
	if( currentProfile.services.google ){
		return currentProfile.services.google.picture;
	} else if ( currentProfile.services.facebook ){
		return currentProfile.services.facebook.picture;
	} else 	{
		return ProfilePictures.findOne(picId).url();
	}
    },

    person: function()
    {
    var parts = location.href.split('/');
	var otherId = parts.pop(); //id of user whose page is being visited
	return Meteor.users.findOne(otherId);
    },
    
    /**
     * Returns the number of people the user (whose profile is being viewed 
     * currently) is following.
     */
    followingCount: function()
    {
    var parts = location.href.split('/');
	//id of user whose page is being visited
	var otherId = parts.pop(); 
	var currentProfile = Meteor.users.findOne(otherId);

	var followings = currentProfile.profile.following;
	if (followings.length == 0){
		return 0;
	} else {
		return (followings.length - 1);	
	}
    },
    
    /**
     * Returns the number of people the user (whose profile is being viewed 
     * currently) is bring followed by.
     */
    followerCount: function()
    {
	var parts = location.href.split('/');
	var otherId = parts.pop(); //id of user whose page is being visited
	var currentProfile = Meteor.users.findOne(otherId);

	var followers = currentProfile.profile.follower;
	if ( !followers ){
		return 0;
	} else {
		return (followers.length);	
	}

    }
});


Template.profileModelFeed.helpers({
    /**
     * models helper finds all the models from the user and then sorts
     * them in reverse chronological order. 
     */
    models: function() 
    {
    var parts = location.href.split('/');
	var urlId = parts.pop(); //id of user whose page is being visited
	
	model = ModelFiles.find({owner: urlId}, {sort:{timeUploaded:-1}});
	if (model.count()) {
	    return model;
	} else {
	    return false;
	} 
    },
    
    /**
     * Returns user details for the profile being viewed currently
     */
    user: function()
    {
    var parts = location.href.split('/');
	var urlId = parts.pop(); //id of user whose page is being visited	
    return Meteor.users.findOne(urlId);
    }
}); 

Template.profileModelFeed.events({
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
		    sAlert.info("Model permanently deleted", {effect: 'flip', onRouteClose: false, stack: false, timeout: 4000, position: 'top'});
		}
  	}
});

Template.profilePage.currentFollowsThis = function()
{
	var parts = location.href.split('/');
	var otherId = parts.pop(); //id of user whose page is being visited	
	var currentUser = Meteor.user();
    var currentFollowsThis = Meteor.users.findOne({_id: currentUser._id, "profile.following": otherId});

    if( currentFollowsThis ){
        return currentFollowsThis;
    }
    else{
       	return null;
    }
}

Template.profilePage.urlUser = function()
{
	var parts = location.href.split('/');
	var otherId = parts.pop(); //id of user whose page is being visited	
	var currentUser = Meteor.user();

    if( currentUser._id != otherId ){
        return otherId;
    }
    else{
       	return null;
    }
}
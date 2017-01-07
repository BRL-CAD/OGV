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
		    	if (error) {
		    		sAlert.error(error.reason);
		    	} else {
		    		sAlert.success("You are now following this user");
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
					sAlert.success("You are no longer following this user");
			    }
			});
		    }
		});		
	}
});


Template.profilePage.helpers({
    countModels: function() {
	var parts = location.href.split('/');
	var otherId = parts.pop(); //id of user whose page is being visited
	return ModelFiles.find({owner: otherId, converted: true}).count();
    },

    currentFollowsThis: function() {
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
    },
    urlUser: function() {	
	var parts = location.href.split('/');
	var otherId = parts.pop(); //id of user whose page is being visited	
	var currentUser = Meteor.user();

	if( currentUser._id != otherId ){
        	return otherId;
    	}
	else{
       		return null;
	}
    },

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
	if(picId){
	   return ProfilePictures.findOne(picId).url();
	} else{
	   return "/icons/User.png";
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
	if (!followings){
		return 0;
	} else {
		return (followings.length);	
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
    posts: function() 
    {
        var parts = location.href.split('/');
	var urlId = parts.pop(); //id of user whose page is being visited
	var followers = Meteor.users.findOne(urlId).profile.follower;
	var isFollower = $.inArray(Meteor.userId(), followers);
	if(Meteor.userId() == urlId){
	   post = Posts.find({postedBy: urlId}, {sort:{postedAt: -1}});
	} else {
	   if(isFollower >= 0){
		audience = ['public', 'followers'];
		post = Posts.find({audience: {$in: audience}, postedBy: urlId }, {sort: {postedAt: -1}});
	   } else{
		post = Posts.find({postedBy: urlId, audience: "public"}, {sort: {postedAd: -1}});
	   }
	}
	if (post.count()) {
	    return post;
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
		    ModelFiles.remove(model._id);
		    sAlert.info("Model permanently deleted");
		}
  	}
});

Template.profilePage.urlUser = function()
{
}

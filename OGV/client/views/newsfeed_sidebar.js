Template.newsfeedSidebar.events({
    /**
    * Follow button functionality for suggested Users.
    */
    'click #followButton': function(e, t)
    {
        var parts = location.href.split('/');
        var otherId = parts.pop(); //id of user whose page is being visited
    
        var currentUser = Meteor.user(); //user who is using OGV at that moment     
        
        //updates "following" array of currentUser
        Meteor.users.update(currentUser._id, {$addToSet: {"profile.following": otherId}}, function(error, res) {
            if (error) {
            throwError(error.reason);
            } else {
            //updates "follower" array of other user
            Meteor.users.update(otherId, {$addToSet: {"profile.follower": currentUser._id}}, function(error, res) {
            /*Meteor.users.update(otherId, {$addToSet: {"profile.follower": currentUser._id}}, function(error, res) {*/
                if (error) {
                    throwError(error.reason);
                } else {
                    throwNotification("You are now following this user");
                }
            });

            }
        });
    }
});

Template.newsfeedSidebar.helpers({
    /**
    * Returns user info of other users
    * All users excluding the ones who are being already followed and the user himself
    * Sorted on the basis of number of Models.
    * Users having highest number of models will be displayed on top.
    */
    suggestownerInfo: function()
    {
        var currentUser = Meteor.user();
        var allUsers = Meteor.users.find( {$and: [{"profile.follower": {$not: currentUser._id}}, {_id: {$not: currentUser._id}}]}, {sort:{"profile.countModels":-1}}).fetch();
        var userIds = _.pluck(allUsers, "_id");
        return Meteor.users.find({_id: {$in: userIds}}, {sort: {createdAt: -1}, limit: 5})
    },

    /**
    * Returns image details of the same users in the same order as mentioned above.
    */
    suggestownerImg: function()
    {
        var currentUser = Meteor.user();
        var otherUser = Meteor.users.find( {$and: [{"profile.follower": {$not: currentUser._id}}, {_id: {$not: currentUser._id}}]}, {$orderby:{'profile.countModels':-1}}).fetch();
        var picIds = _.pluck(otherUser, "_id");
        return ProfilePictures.find({user: {$in :picIds}}, {sort:{createdAt: -1}, limit: 5});
    },
    
});

/**
* returns details about the current user to be displayed on the newsfeed
*/
Template.newsfeedSidebar.myInfo = function()
{
    var currentUser =  Meteor.user();
    picId = currentUser.profile.pic;
    var followings = currentUser.profile.following;
    var followers = currentUser.profile.follower;
    var numberfollowings, numberfollowers;

    if(followings.length == 0){
        numberfollowings = 0
    } else {
        numberfollowings = followings.length - 1;
    }

    if ( !followers ){
        numberfollowers = 0;
    } else {
        numberfollowers = followers.length;  
    }

    return {
        myUser: currentUser,
        userImg: ProfilePictures.findOne(picId),
        followerCount: numberfollowers,
        followingCount: numberfollowings
    };
}
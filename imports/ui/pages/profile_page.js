import "./profile_page.html";
import "../components/model_post.js";

Template.profilePage.events({
  "click #followButton": function() {
    const parts = location.href.split("/");
    const otherId = parts.pop(); // id of user whose page is being visited
    const currentUser = Meteor.user(); // user who is using OGV at that moment

    // updates "following" array of currentUser
    Meteor.users.update(
      currentUser._id,
      {
        $addToSet: {
          "profile.following": otherId
        }
      },
      error => {
        if (error) {
          sAlert.error(error.reason);
        } else {
          // updates "follower" array of other user
          Meteor.users.update(
            otherId,
            {
              $addToSet: {
                "profile.follower": currentUser._id
              }
            },
            error2 => {
              if (error2) {
                sAlert.error(error.reason);
              } else {
                sAlert.success("You are now following this user");
              }
            }
          );
        }
      }
    );
  },

  "click #unfollowButton": function() {
    const parts = location.href.split("/");
    // id of user whose page is being visited
    const otherId = parts.pop();

    const currentUser = Meteor.user(); // user who is using OGV at that moment

    // updates "following" array of currentUser
    Meteor.users.update(
      currentUser._id,
      {
        $pull: {
          "profile.following": otherId
        }
      },
      error => {
        if (error) {
          sAlert.error(error.reason);
        } else {
          // updates "follower" array of other user
          Meteor.users.update(
            otherId,
            {
              $pull: {
                "profile.follower": currentUser._id
              }
            },
            error2 => {
              if (error2) {
                sAlert.error(error.reason);
              } else {
                sAlert.success("You are no longer following this user");
              }
            }
          );
        }
      }
    );
  }
});

Template.profilePage.helpers({
  countModels() {
    const parts = location.href.split("/");
    const otherId = parts.pop(); // id of user whose page is being visited
    return ModelFiles.find({
      owner: otherId,
      converted: true
    }).count();
  },

  currentFollowsThis() {
    const parts = location.href.split("/");
    const otherId = parts.pop(); // id of user whose page is being visited
    const currentUser = Meteor.user();
    const currentFollowsThis = Meteor.users.findOne({
      _id: currentUser._id,
      "profile.following": otherId
    });

    if (currentFollowsThis) {
      return currentFollowsThis;
    }
    return null;
  },
  urlUser() {
    const parts = location.href.split("/");
    const otherId = parts.pop(); // id of user whose page is being visited
    const currentUser = Meteor.user();

    if (currentUser._id !== otherId) {
      return otherId;
    }
    return null;
  },

  /**
     * returns image of the user from database, if there's no image a default
     * image is shown.
     */
  userImg() {
    const parts = location.href.split("/");
    const otherId = parts.pop(); // id of user whose page is being visited
    const currentProfile = Meteor.users.findOne(otherId);
    const picId = currentProfile.profile.pic;
    if (picId) {
      return ProfilePictures.findOne(picId).url();
    }
    return "/icons/User.png";
  },

  person() {
    const parts = location.href.split("/");
    const otherId = parts.pop(); // id of user whose page is being visited
    return Meteor.users.findOne(otherId);
  },

  /**
     * Returns the number of people the user (whose profile is being viewed
     * currently) is following.
     */
  followingCount() {
    const parts = location.href.split("/");
    // id of user whose page is being visited
    const otherId = parts.pop();
    const currentProfile = Meteor.users.findOne(otherId);

    const followings = currentProfile.profile.following;
    if (!followings) {
      return 0;
    }
    return followings.length;
  },

  /**
     * Returns the number of people the user (whose profile is being viewed
     * currently) is bring followed by.
     */
  followerCount() {
    const parts = location.href.split("/");
    const otherId = parts.pop(); // id of user whose page is being visited
    const currentProfile = Meteor.users.findOne(otherId);

    const followers = currentProfile.profile.follower;
    if (!followers) {
      return 0;
    }
    return followers.length;
  }
});

Template.profileModelFeed.helpers({
  /**
     * models helper finds all the models from the user and then sorts
     * them in reverse chronological order.
     */
  posts() {
    const parts = location.href.split("/");
    const urlId = parts.pop(); // id of user whose page is being visited
    const followers = Meteor.users.findOne(urlId).profile.follower;
    const isFollower = $.inArray(Meteor.userId(), followers);
    if (Meteor.userId() === urlId) {
      post = Posts.find(
        {
          postedBy: urlId
        },
        {
          sort: {
            postedAt: -1
          }
        }
      );
      // model = ModelFiles.find({owner: urlId}, {sort:{timeUploaded:-1}});
    } else if (isFollower >= 0) {
      audience = ["public", "followers"];
      post = Posts.find(
        {
          audience: {
            $in: audience
          },
          postedBy: urlId
        },
        {
          sort: {
            postedAt: -1
          }
        }
      );
      // model = ModelFiles.find( {audience: {$in: audience}, owner:urlId }, {sort: {timeUploaded: -1}});
    } else {
      post = Posts.find(
        {
          postedBy: urlId,
          audience: "public"
        },
        {
          sort: {
            postedAd: -1
          }
        }
      );
      // model = ModelFiles.find({owner: urlId, audience: "public"}, {sort:{timeUploaded:-1}});
    }
    if (post.count()) {
      return post;
    }
    return false;
  },

  /**
 * Returns user details for the profile being viewed currently
 */
  user() {
    const parts = location.href.split("/");
    const urlId = parts.pop(); // id of user whose page is being visited
    return Meteor.users.findOne(urlId);
  }
});

Template.profileModelFeed.events({
  "click #deleteModel": function() {
    const r = confirm("Are you sure, you want to delete your model?");
    if (r === true) {
      // Removing both ThumbFiles and ModelFiles associated with the give model id
      const model = ModelFiles.findOne(this._id);
      ModelFiles.remove(model._id);
      sAlert.info("Model permanently deleted");
    }
  }
});

Template.profilePage.urlUser = function() {};

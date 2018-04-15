import "./newsfeed_sidebar.html";

Template.newsfeedSidebar.events({
  /**
     * Follow button functionality for suggested Users.
     */
  "click #followButton": function() {
    let otherId;
    button = $("#followButton")[0];
    if (button.dataset.src) {
      otherId = button.dataset.src;
    } else {
      const parts = location.href.split("/");
      otherId = parts.pop(); // id of user whose page is being visited
    }
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
  }
});

Template.newsfeedSidebar.items = function() {
  return popular_Models();
};

Template.newsfeedSidebar.helpers({
  /**
     * Returns user info of other user
     * All users excluding the ones who are being already followed and the user himself
     * Sorted on the basis of number of Models.
     * Users having highest number of models will be displayed on top.
     */
  suggestownerInfo() {
    const currentUser = Meteor.user();
    return Meteor.users.find(
      {
        $and: [
          {
            "profile.follower": {
              $not: currentUser._id
            }
          },
          {
            _id: {
              $not: currentUser._id
            }
          }
        ]
      },
      {
        sort: {
          "profile.follower": -1
        },
        limit: 1
      }
    );
  },

  /**
     * Returns image details of the same users in the same order as mentioned above.
     */
  suggestownerImg() {
    const currentUser = Meteor.user();
    const otherUser = Meteor.users
      .find(
        {
          $and: [
            {
              "profile.follower": {
                $not: currentUser._id
              }
            },
            {
              _id: {
                $not: currentUser._id
              }
            }
          ]
        },
        {
          sort: {
            createdAt: -1
          }
        }
      )
      .fetch();
    const picIds = _.pluck(otherUser, "_id");
    return ProfilePictures.find(
      {
        user: {
          $in: picIds
        }
      },
      {
        limit: 1
      }
    );
  },

  /**
     * Returns models based on popularity be seeing the number of views.
     */
  suggestedModel() {
    const currentUser = Meteor.user();
    return ModelFiles.find({
      owner: {
        $not: currentUser._id
      }
    });
  },

  sharedModel() {
    const currentUser = Meteor.user();
    if (!currentUser.profile.following) {
      return false;
    }
    model = SharedModels.find(
      {
        sharedby: {
          $in: currentUser.profile.following
        }
      },
      {
        sort: {
          timeShared: -1
        }
      }
    );

    if (model.count()) {
      return model;
    }
    return false;
  }
});

Template.shareTickr.helpers({
  shareMessage() {
    const userName = Meteor.users.findOne(this.sharedby).profile.name;
    const ownerName = Meteor.users.findOne(this.ownerId).profile.name;
    const modelName = ModelFiles.findOne(this.model).name;
    const message = `${userName} shared ${ownerName}'s model ${modelName}`;
    return message;
  }
});

Meteor.subscribe("popular_Models");

/**
 * returns details about the current user to be displayed on the newsfeed
 */

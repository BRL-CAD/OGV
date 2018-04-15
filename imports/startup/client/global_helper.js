Template.registerHelper("embeddedView", () => {
  const url = Router.current().url,
    parts = url.split("="),
    shared = parts.pop();
  if (shared === "true") {
    return true;
  }
  return false;
});

Template.registerHelper("loggedInUser", () => {
  const user = Meteor.user();
  const picId = user.profile.pic;
  const name = user.profile.name;
  let picUrl;
  if (picId && ProfilePictures.findOne(picId)) {
    picUrl = ProfilePictures.findOne(picId).url();
  } else {
    picUrl = "/icons/User.png";
  }
  const followings = user.profile.following;
  const followers = user.profile.follower;
  const modelsCount = ModelFiles.find({
    owner: user._id,
    converted: true
  }).count();

  if (!followings) {
    followingsCount = 0;
  } else {
    followingsCount = followings.length;
  }

  if (!followers) {
    followersCount = 0;
  } else {
    followersCount = followers.length;
  }

  return {
    obj: user,
    profilePic: picUrl,
    username: name,
    _id: user._id,
    followingCount: followingsCount,
    followerCount: followersCount,
    modelsCount
  };
});

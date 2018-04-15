postSchema = new SimpleSchema({
  postType: {
    type: String
  },
  postedAt: {
    type: Date
  },
  postId: {
    type: String
  },
  postedBy: {
    type: String
  },
  audience: {
    type: String
  }
});

Posts = new Meteor.Collection("posts");
Posts.attachSchema(postSchema);

Posts.allow({
  insert(userId) {
    const id = Meteor.userId();
    return id === userId;
  }
});

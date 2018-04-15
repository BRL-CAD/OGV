import "./social.html";
import "./social.css";

/**
 * Comments and its backend implementation
 */
Template.comment.helpers({
  submittedText() {
    return new Date(this.submitted).toString();
  }
});

Template.commentSubmit.events({
  "submit form": function(e) {
    e.preventDefault();
    const $body = $(e.target).find("[name=body]");
    if (this.converted) {
      postId = this._id;
    } else {
      postId = this.postId;
    }
    const comment = {
      body: $body.val(),
      postId
    };

    Meteor.call("comment", comment, (error, commentId) => {
      if (error) {
        sAlert.error(error.reason);
      } else {
        $body.val("");
        const commentOnModel = Comments.findOne(commentId);
        ModelFiles.update(commentOnModel.postId, {
          $inc: {
            commentsCount: 1
          }
        });
      }
    });
  }
});

Template.commentBody.helpers({
  comments() {
    let commentList = Comments.find({
      postId: this.postId || this._id
    });
    if (!commentList) {
      commentList = Comments.find({ postId: this.data._id });
    }
    return commentList;
  }
});

Template.comments.events({
  "click .comments-header": function(e) {
    console.log(e);
    $header = $(e.currentTarget);
    console.log($header);
    $content = $header.next();
    $content.slideToggle(500, () => {
      $header.text(
        () => ($content.is(":visible") ? "Hide Comments" : "Show Comments")
      );
    });
  }
});

/**
 * Likes and its backend implementation
 */
Template.lovemeter.events({
  "click .lovemeter-wrapper": function() {
    const love = {
      postId: this.postId
    };
    Meteor.call("love", love, error => {
      if (error) {
        sAlert.error(error.reason);
      }
    });
  }
});

Template.lovemeter.helpers({
  lovers() {
    if (this.postId) {
      id = this.postId;
    } else {
      id = this._id;
    }
    loversObj = Lovers.findOne({
      postId: id
    });
    if (loversObj) {
      loversArray = loversObj.lovers;
      return loversArray.length;
    }
    return 0;
  }
});

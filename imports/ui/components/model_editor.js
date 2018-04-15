import "./model_editor.html";

Template.modelEditor.events({
  "change .color-picker": function(e) {
    color = e.currentTarget.value;
    colorhex = color.replace("#", "0x");
    colorhex = parseInt(colorhex, 16);

    index = e.currentTarget.dataset.src;
    objFile = this._id;
    OBJFiles.update(objFile, { $set: { color } });
    OBJMaterialArray[index].color = new THREE.Color(colorhex);
  },

  "click .all-objs": function() {
    eyePath = $(".eye-img").attr("src");
    if (eyePath === "/icons/eye.png") {
      $(".eye-img").attr("src", "/icons/not-eye.png");
      $(".white-eye-img").attr("src", "/icons/white-not-eye.png");

      group.traverse(object => {
        object.visible = false;
      });
    } else {
      $(".eye-img").attr("src", "/icons/eye.png");
      $(".white-eye-img").attr("src", "/icons/white-eye.png");

      group.traverse(object => {
        object.visible = true;
      });
    }
  },

  "click .obj-heading": function(e) {
    test = e;
    index = e.currentTarget.dataset.src;
    if (e.target.classList[0] === "eye-img") {
      eyeImg = e.target;
      if (eyeImg.attributes.src.value === "/icons/not-eye.png") {
        group.children[index].traverse(object => {
          object.visible = true;
        });
        eyeImg.src = "/icons/eye.png";
      } else {
        group.children[index].traverse(object => {
          object.visible = false;
        });
        eyeImg.src = "/icons/not-eye.png";
      }
    } else {
      controlDiv = e.currentTarget.nextElementSibling;
      $(controlDiv).slideToggle("fast");
    }
  },

  "click .edit-thumb-btn": function() {
    imageData = renderer.domElement.toDataURL("image/png");
    model = ModelFiles.findOne(this._id);
    ModelFiles.update(this._id, { $set: { screenshot: imageData } }, error => {
      if (error) {
        sAlert.error(error.reason);
      } else {
        sAlert.success("Updated thumbnail preview");
      }
    });
  },

  "click .model-tools-icon": function() {
    $(".ec-model").removeClass("ec-inactive");
    $(".comments-toolbar").addClass("ec-inactive");
  },

  "click .comments-icon": function() {
    $(".comments-toolbar").removeClass("ec-inactive");
    $(".ec-model").addClass("ec-inactive");
  },

  "click .menu-toggle": function() {
    $(".edit-controls").toggleClass("edit-controls-hidden");
  },

  "keyup .obj-search-bar": _.throttle(function(e) {
    test = e;
    searchQuery = e.currentTarget.value.trim();
    const options = { gFile: this._id };
    ObjSearch.search(searchQuery, options);
  }, 200)
});

const objfields = ["original.name", "gFile"];
ObjSearch = new SearchSource("objFiles", objfields);

Template.modelEditor.helpers({
  object() {
    return ObjSearch.getData({
      transform(matchText, regExp) {
        return matchText.replace(regExp, "$&");
      }
    });
  },

  youAreOwner() {
    const loggedIn = Meteor.userId();
    if (loggedIn === this.owner) {
      return true;
    }
    return false;
  },

  comments() {
    return Comments.find({ postId: this._id });
  }
});

Template.modelEditor.rendered = function() {
  gfile = $(".edit-controls-wrapper").data("src");
  const options = { gFile: gfile };
  ObjSearch.search("", options);
};

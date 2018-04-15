import "./explore.html";

let filterArray, text;

Template.explore.events({
  "keyup .search-textbox": _.throttle(e => {
    searchQuery = e.currentTarget.value.trim();
    ModelSearch.search(searchQuery);
    UserSearch.search(searchQuery);
    if (searchQuery.length < 1) {
      $(".result-container").css("display", "none");
    } else {
      $(".result-container").css("display", "block");
    }
  }, 200),

  "change .filter-select": function(e) {
    const newValue = $(e.target).val();
    text = document.getElementById("selected-filters");
    const addText = document.createTextNode(`${newValue} + `);
    text.appendChild(addText);
  },

  "click #undo-latest": function() {
    const filters = document.getElementById("selected-filters").innerHTML;
    filterArray = filters.split(" + ");
    text = "";
    filterArray.pop();
    text = filterArray.join(" + ").toString();
    document.getElementById("selected-filters").innerHTML = text;
  },

  "click #save-btn": function() {
    filterArray = text.innerHTML.split(" + ");
    alert(filterArray);
    text.innerHTML = "";
  }
});

const options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
const fields = ["name", "about"];
const userFields = ["profile.name", "profile.bio"];

ModelSearch = new SearchSource("modelFiles", fields, options);
UserSearch = new SearchSource("users", userFields, options);

Template.searchResult.helpers({
  getModels() {
    return ModelSearch.getData({
      transform(matchText, regExp) {
        return matchText.replace(regExp, "$&");
      },
      sort: {
        timeUploaded: -1
      }
    });
  },

  isLoading() {
    return ModelSearch.getStatus().loading;
  }
});

Template.searchUserResult.helpers({
  getUsers() {
    return UserSearch.getData({
      transform(matchText, regExp) {
        return matchText.replace(regExp, "$&");
      },
      sort: {
        createdAt: -1
      }
    }).map(user => {
      user.profilePic = user.profile.pic
        ? ProfilePictures.findOne(user.profile.pic).url()
        : "/icons/User.png";
      return user;
    });
  },

  isLoading() {
    return UserSearch.getStatus().loading;
  }
});

Template.searchResult.rendered = function() {
  ModelSearch.search("");
};

Template.searchUserResult.rendered = function() {
  UserSearch.search("");
};

/*
Template.exploreResult.helpers ({
    models: function() {
        var filters = document.getElementById('selected-filters').innerHTML;
        var filterArray = filters.split(" + ");
        var currentUser = Meteor.user();

        model = ModelFiles.find(
             {owner: {$not: currentUser._id}}, {categories: {$elemMatch: {$in: filterArray}}});
        if (model.count()) {
            return model;
        } else {
            return false;
        }
    }
})
*/

Template.exploreResult.helpers({
  /**
     * models helper finds all the models from the database and then sorts
     * them in reverse chronological order.
     */
  models() {
    const currentUser = Meteor.user();
    const audience = ["public", "followers"];
    model = ModelFiles.find(
      {
        converted: true,
        audience: {
          $in: audience
        },
        owner: {
          $in: currentUser.profile.following
        }
      },
      {
        sort: {
          timeUploaded: -1
        }
      }
    );
    if (model.count()) {
      return model;
    }
    return false;
  }
});
